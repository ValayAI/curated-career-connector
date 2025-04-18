
import { corsHeaders } from '../_shared/cors.ts'

// This endpoint allows us to fetch job listings from the RapidAPI JSearch API

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request parameters from the body
    const { page = 1, limit = 10, keywords = '', location = '' } = await req.json()
    
    console.log('Received request for jobs with params:', { page, limit, keywords, location })

    // Get the RapidAPI key from environment variables
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY')

    if (!RAPIDAPI_KEY) {
      console.log('RapidAPI key not configured, using sample data')
      
      // Return sample data if credentials are missing
      return new Response(
        JSON.stringify({
          message: 'Using sample data (RapidAPI key not configured)',
          data: getSampleJobs(limit, keywords)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    try {
      console.log('Attempting to fetch jobs from RapidAPI JSearch API')
      
      // Prepare query parameters - using correct JSearch endpoint structure
      const endpoint = "/search";
      
      // Add query parameters for job filtering
      const queryParams = new URLSearchParams();
      
      // JSearch API parameters
      queryParams.append('page', page.toString());
      queryParams.append('num_pages', '1');
      queryParams.append('date_posted', 'today');
      
      // IMPORTANT FIX: Always provide a default query if none is provided
      const queryTerm = keywords || 'all jobs';
      queryParams.append('query', queryTerm);
      
      if (location) {
        queryParams.append('location', location);
      }
      
      // Add employment type filter parameter
      queryParams.append('employment_types', 'FULLTIME');
      
      // Append query parameters to endpoint
      const queryString = queryParams.toString();
      const fullEndpoint = `${endpoint}?${queryString}`;
      
      console.log(`Making request to JSearch API: ${fullEndpoint}`);
      
      // Make request to RapidAPI
      const response = await fetch(`https://jsearch.p.rapidapi.com${fullEndpoint}`, {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`RapidAPI request failed with status ${response.status}: ${errorText}`);
        throw new Error(`RapidAPI request failed with status ${response.status}: ${errorText}`);
      }
      
      const rapidApiData = await response.json();
      console.log(`Received response from RapidAPI JSearch: `, rapidApiData);
      
      if (!rapidApiData.data || !Array.isArray(rapidApiData.data)) {
        console.error('Invalid data format received from RapidAPI:', rapidApiData);
        throw new Error('Invalid data format received from RapidAPI');
      }
      
      console.log(`Received ${rapidApiData.data.length || 0} jobs from RapidAPI`);
      
      // Log a sample job to understand the structure
      if (rapidApiData.data.length > 0) {
        console.log('Sample job structure:', JSON.stringify(rapidApiData.data[0], null, 2));
      }
      
      // Transform the API response to match our job data structure
      const transformedJobs = transformRapidApiData(rapidApiData.data, limit);
      
      return new Response(
        JSON.stringify({
          message: 'Using data from RapidAPI JSearch API',
          data: transformedJobs
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error('Error fetching from RapidAPI:', apiError);
      // Fall back to sample data on API error
      return new Response(
        JSON.stringify({
          message: 'Error with RapidAPI JSearch API, using sample data instead',
          data: getSampleJobs(limit, keywords),
          error: apiError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in jobs function:', error)
    
    return new Response(
      JSON.stringify({
        message: 'Error occurred, using sample data',
        data: getSampleJobs(10), // Return sample data even on error
        error: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 } // Return 200 instead of 500
    )
  }
})

// Transform RapidAPI JSearch data to match our job data structure
function transformRapidApiData(apiData: any[], limit = 10) {
  // Handle empty or invalid data
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    console.warn('No data received from RapidAPI or invalid data format');
    return [];
  }

  // Map the API data to our job structure
  return apiData.slice(0, limit).map((job: any, index: number) => {
    // Generate random values for fields not provided by the API
    const connectionTypes: ["None", "Second", "First", "Alumni"] = ["None", "Second", "First", "Alumni"];
    const connectionType = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
    const industries = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Education", "Media"];
    const experiences = ["Entry Level", "Mid Level", "Senior", "Executive"];
    
    return {
      id: job.job_id || `rapid-${index + 1}`.padStart(10, '0'),
      title: job.job_title || 'Job Title Not Available',
      company: job.employer_name || 'Company Not Available',
      location: job.job_city ? `${job.job_city}, ${job.job_state || job.job_country || ''}` : (job.job_country || 'Remote'),
      type: job.job_is_remote ? "Remote" : ["Onsite", "Hybrid"][Math.floor(Math.random() * 2)],
      salary: job.job_min_salary && job.job_max_salary 
             ? `$${job.job_min_salary}-$${job.job_max_salary} ${job.job_salary_currency || 'USD'}`
             : 'Salary not specified',
      logo: job.employer_logo || `https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64`,
      position: job.job_title?.includes('Manager') ? 'Product Manager' : 'Developer',
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      connection: {
        type: connectionType as any,
        name: connectionType !== 'None' ? `Connection ${index}` : undefined,
        position: connectionType !== 'None' ? 'Team Member' : undefined
      },
      applicationRate: Math.floor(Math.random() * 40) + 50, // Random rate between 50-90%
      featured: Math.random() > 0.7, // Randomly set some jobs as featured
      posted: job.job_posted_at_datetime_utc || new Date().toISOString(),
      description: job.job_description || 'No description available',
      responsibilities: (job.job_highlights?.Responsibilities || [
        "Responsibility information not available",
        "Check job description for details"
      ]),
      requirements: (job.job_highlights?.Qualifications || [
        "Requirement information not available",
        "Check job description for details"
      ]),
      recruiterActivity: Math.floor(Math.random() * 10) + 1,
    };
  });
}

// Sample jobs data function to use when RapidAPI is not available
function getSampleJobs(limit = 10, keywordFilter = '') {
  const sampleJobs = [
    {
      id: "linkedin-001",
      title: "Senior Product Manager",
      company: "TechVision Inc.",
      location: "San Francisco, CA",
      type: "Hybrid",
      salary: "$130,000 - $160,000",
      logo: "https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64",
      position: "Product Manager",
      experience: "Senior",
      industry: "Technology",
      connection: {
        type: "Second",
        name: "Alex Chen",
        position: "Engineering Manager"
      },
      applicationRate: 78,
      featured: true,
      posted: new Date().toISOString(),
      description: "We're looking for an experienced product manager to lead our core product initiatives. You'll work with engineering, design, and marketing teams to define product strategy and roadmap.",
      responsibilities: [
        "Define product vision and strategy",
        "Gather and prioritize product requirements",
        "Work with engineering teams to deliver features",
        "Analyze market trends and competition",
        "Define success metrics and track outcomes"
      ],
      requirements: [
        "5+ years of product management experience",
        "Strong analytical and problem-solving skills",
        "Experience with agile development methodologies",
        "Excellent communication and stakeholder management skills",
        "Bachelor's degree in related field"
      ],
      recruiterActivity: 8
    },
    {
      id: "linkedin-002",
      title: "UX/UI Designer",
      company: "Creative Solutions",
      location: "New York, NY",
      type: "Remote",
      salary: "$90,000 - $120,000",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64",
      position: "Designer",
      experience: "Mid Level",
      industry: "Media",
      connection: {
        type: "First",
        name: "Sarah Johnson",
        position: "Design Director"
      },
      applicationRate: 65,
      featured: false,
      posted: new Date().toISOString(),
      description: "Join our creative team to design beautiful and functional user experiences for our clients. You'll collaborate with product managers and developers to create intuitive interfaces.",
      responsibilities: [
        "Create wireframes, prototypes, and high-fidelity designs",
        "Conduct user research and usability testing",
        "Develop and maintain design systems",
        "Collaborate with cross-functional teams",
        "Stay updated with latest design trends"
      ],
      requirements: [
        "3+ years of UI/UX design experience",
        "Proficiency with Figma, Sketch, and other design tools",
        "Portfolio demonstrating strong visual design skills",
        "Understanding of user-centered design principles",
        "Experience with responsive web design"
      ],
      recruiterActivity: 7
    },
    {
      id: "linkedin-003",
      title: "Frontend Developer",
      company: "WebTech Solutions",
      location: "Austin, TX",
      type: "Remote",
      salary: "$100,000 - $130,000",
      logo: "https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64",
      position: "Developer",
      experience: "Mid Level",
      industry: "Technology",
      connection: {
        type: "Second",
        name: "Michael Brown",
        position: "Tech Lead"
      },
      applicationRate: 72,
      featured: true,
      posted: new Date().toISOString(),
      description: "We're seeking a talented frontend developer to join our engineering team. You'll build responsive web applications using modern JavaScript frameworks.",
      responsibilities: [
        "Develop user-facing features using React and TypeScript",
        "Build reusable components and libraries",
        "Optimize applications for performance",
        "Collaborate with backend developers and designers",
        "Write unit and integration tests"
      ],
      requirements: [
        "3+ years of frontend development experience",
        "Strong knowledge of React, TypeScript, and modern JavaScript",
        "Experience with state management libraries",
        "Understanding of responsive design principles",
        "Familiarity with testing frameworks"
      ],
      recruiterActivity: 9
    },
    {
      id: "linkedin-004",
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "Chicago, IL",
      type: "Hybrid",
      salary: "$120,000 - $150,000",
      logo: "https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64",
      position: "Data Scientist",
      experience: "Senior",
      industry: "Technology",
      connection: {
        type: "None"
      },
      applicationRate: 68,
      featured: false,
      posted: new Date().toISOString(),
      description: "Join our data science team to build predictive models and extract insights from complex datasets. You'll work on challenging problems across various business domains.",
      responsibilities: [
        "Develop machine learning models for prediction and classification",
        "Clean and preprocess large datasets",
        "Perform statistical analysis and hypothesis testing",
        "Communicate findings to technical and non-technical stakeholders",
        "Collaborate with engineering to deploy models to production"
      ],
      requirements: [
        "Masters or PhD in Statistics, Computer Science, or related field",
        "4+ years of experience in data science or machine learning",
        "Proficiency in Python and data science libraries",
        "Experience with SQL and data visualization tools",
        "Strong mathematical and statistical knowledge"
      ],
      recruiterActivity: 6
    },
    {
      id: "linkedin-005",
      title: "Project Manager",
      company: "Global Constructions",
      location: "Denver, CO",
      type: "Onsite",
      salary: "$90,000 - $110,000",
      logo: "https://images.unsplash.com/photo-1563461660947-507ef49e9c47?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64",
      position: "Project Manager",
      experience: "Mid Level",
      industry: "Construction",
      connection: {
        type: "Alumni",
        name: "Jessica Lee",
        position: "Operations Director"
      },
      applicationRate: 75,
      featured: false,
      posted: new Date().toISOString(),
      description: "We're looking for a project manager to oversee construction projects from inception to completion. You'll coordinate with clients, contractors, and internal teams.",
      responsibilities: [
        "Develop project plans and schedules",
        "Coordinate resources and team members",
        "Monitor project progress and budget",
        "Manage client expectations and communications",
        "Ensure compliance with safety and regulatory requirements"
      ],
      requirements: [
        "3+ years of project management experience in construction",
        "PMP certification preferred",
        "Strong organizational and leadership skills",
        "Experience with project management software",
        "Understanding of construction processes and regulations"
      ],
      recruiterActivity: 7
    }
  ];

  // Filter by keyword if provided
  let filteredJobs = sampleJobs;
  if (keywordFilter) {
    const keywords = keywordFilter.toLowerCase().split(',');
    filteredJobs = sampleJobs.filter(job => {
      return keywords.some(keyword => 
        job.title.toLowerCase().includes(keyword.trim()) || 
        job.position.toLowerCase().includes(keyword.trim()) ||
        job.company.toLowerCase().includes(keyword.trim()) ||
        job.industry.toLowerCase().includes(keyword.trim())
      );
    });
  }

  // Return requested number of sample jobs (with duplicates if needed)
  const result = [];
  for (let i = 0; i < limit; i++) {
    if (filteredJobs.length === 0) break; // If no jobs match filter, return empty array
    const job = {...filteredJobs[i % filteredJobs.length]};
    job.id = `linkedin-${i + 1}`.padStart(10, '0');
    result.push(job);
  }
  
  return result;
}
