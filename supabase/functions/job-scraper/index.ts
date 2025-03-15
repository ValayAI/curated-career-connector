
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY") || "e9a16b9601msh34884a236539dd1p10f2e7jsn7b9ca38f9b4d";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { position = "Product Manager", location = "United States" } = await req.json();
    
    console.log(`Fetching jobs for position: ${position}, location: ${location}`);
    
    // First try the hiring-manager-api endpoint
    try {
      const response = await fetch("https://hiring-manager-api.p.rapidapi.com/recruitment-manager-24h", {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "hiring-manager-api.p.rapidapi.com",
        },
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response received successfully");
      
      // Process the response data
      const jobs = processHiringManagerApiData(data, position);
      
      return new Response(
        JSON.stringify({
          message: `Successfully fetched jobs from Hiring Manager API for ${position}`,
          data: jobs,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error with hiring-manager-api:", error);
      
      // Fall back to the jobs-api endpoint
      try {
        const jsearchResponse = await fetch(
          `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
            `${position} in ${location}`
          )}&page=1&num_pages=1`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": RAPIDAPI_KEY,
              "x-rapidapi-host": "jsearch.p.rapidapi.com",
            },
          }
        );
        
        if (!jsearchResponse.ok) {
          throw new Error(`JSearch API responded with status: ${jsearchResponse.status}`);
        }
        
        const jsearchData = await jsearchResponse.json();
        const jobs = processJSearchData(jsearchData);
        
        return new Response(
          JSON.stringify({
            message: `Successfully fetched jobs from JSearch API for ${position}`,
            data: jobs,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (jsearchError) {
        console.error("Error with JSearch API:", jsearchError);
        throw new Error("Both API endpoints failed");
      }
    }
  } catch (error) {
    console.error("Error in job-scraper function:", error);
    
    return new Response(
      JSON.stringify({
        message: "Error fetching jobs",
        error: error.message,
        data: [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

function processHiringManagerApiData(data: any, requestedPosition: string) {
  // This function processes the data from the hiring-manager-api
  // You'll need to adjust this based on the actual response structure
  if (!data || !Array.isArray(data.jobs)) {
    console.warn("Unexpected data structure from hiring-manager-api");
    return [];
  }
  
  return data.jobs.map((job: any) => {
    return {
      id: job.id || `job-${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || `${requestedPosition} Position`,
      company: job.company || "Company not available",
      location: job.location || "Remote",
      type: job.job_type || "Full-time",
      salary: job.salary_range || "Competitive",
      logo: job.company_logo || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64",
      description: job.description || "No description provided",
      responsibilities: job.responsibilities ? 
        (Array.isArray(job.responsibilities) ? job.responsibilities : [job.responsibilities]) : 
        ["Responsibilities not specified"],
      requirements: job.requirements ? 
        (Array.isArray(job.requirements) ? job.requirements : [job.requirements]) : 
        ["Requirements not specified"],
      posted: job.posted_date || new Date().toISOString(),
      deadline: job.deadline || null,
      position: requestedPosition,
      experience: job.experience_level || "Mid Level",
      industry: job.industry || "Technology",
      recruiterActivity: job.recruiter_activity || Math.floor(Math.random() * 10) + 1,
      applicationRate: job.application_rate || Math.floor(Math.random() * 40) + 50,
      featured: job.featured || Math.random() > 0.7,
      connection: {
        type: job.connection_type || ["None", "Second", "First", "Alumni"][Math.floor(Math.random() * 4)],
        name: job.connection_name || null,
        position: job.connection_position || null
      }
    };
  });
}

function processJSearchData(data: any) {
  if (!data || !data.data) {
    return [];
  }
  
  return data.data.map((item: any) => {
    const job = item.job_title || "";
    let position = "Product Manager";
    
    if (job.toLowerCase().includes("product manager")) {
      position = "Product Manager";
    } else if (job.toLowerCase().includes("program manager")) {
      position = "Program Manager";
    } else if (job.toLowerCase().includes("project manager")) {
      position = "Project Manager";
    } else if (job.toLowerCase().includes("business analyst")) {
      position = "Business Analyst";
    } else if (job.toLowerCase().includes("data analyst")) {
      position = "Data Analyst";
    }
    
    return {
      id: item.job_id || `job-${Math.random().toString(36).substr(2, 9)}`,
      title: item.job_title || position,
      company: item.employer_name || "Company not available",
      location: item.job_city ? `${item.job_city}, ${item.job_state || ""}` : item.job_country || "Remote",
      type: item.job_employment_type || "Full-time",
      salary: item.job_min_salary && item.job_max_salary
        ? `$${item.job_min_salary.toLocaleString()} - $${item.job_max_salary.toLocaleString()}`
        : "Competitive",
      logo: item.employer_logo || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64",
      description: item.job_description || "No description provided",
      responsibilities: ["Responsibilities will be discussed during the interview"],
      requirements: item.job_required_skills ? item.job_required_skills.split(",") : ["No specific requirements listed"],
      posted: item.job_posted_at_datetime_utc || new Date().toISOString(),
      deadline: null,
      position: position,
      experience: "Mid Level",
      industry: "Technology",
      recruiterActivity: Math.floor(Math.random() * 10) + 1,
      applicationRate: Math.floor(Math.random() * 40) + 50,
      featured: Math.random() > 0.7,
      connection: {
        type: ["None", "Second", "First", "Alumni"][Math.floor(Math.random() * 4)],
        name: null,
        position: null
      }
    };
  });
}
