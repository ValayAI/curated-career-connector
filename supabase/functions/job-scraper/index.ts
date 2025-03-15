
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { position = 'Product Manager', location = '' } = await req.json();
    
    console.log(`Scraping jobs for position: ${position}, location: ${location}`);
    
    // Define the allowed positions
    const allowedPositions = [
      'Product Manager',
      'Program Manager',
      'Project Manager',
      'Business Analyst',
      'Data Analyst'
    ];

    // Check if the requested position is allowed
    if (!allowedPositions.includes(position)) {
      return new Response(
        JSON.stringify({
          message: 'Invalid position specified',
          error: 'Position must be one of the allowed positions',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Construct the URL for scraping
    const encodedPosition = encodeURIComponent(`"${position}"`);
    const encodedLocation = location ? encodeURIComponent(`"${location}"`) : encodeURIComponent('"United States"');
    const url = `https://active-jobs-db.p.rapidapi.com/active-ats-24h?title_filter=${encodedPosition}&location_filter=${encodedLocation}`;

    // Get the RapidAPI key from environment variables
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');

    if (!RAPIDAPI_KEY) {
      console.log('RapidAPI key not configured, returning sample data');
      // Return sample data if credentials are missing
      return new Response(
        JSON.stringify({
          message: 'Using sample data (RapidAPI key not configured)',
          data: getSampleJobs(position, 10)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      console.log(`Making request to Active Jobs DB API: ${url}`);
      
      // Make request to RapidAPI
      const response = await fetch(url, {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'active-jobs-db.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`RapidAPI request failed with status ${response.status}: ${errorText}`);
        throw new Error(`RapidAPI request failed with status ${response.status}: ${errorText}`);
      }
      
      const rapidApiData = await response.json();
      console.log(`Received response from Active Jobs DB API with ${rapidApiData.length || 0} jobs`);
      
      // Transform the API response to match our job data structure
      const transformedJobs = transformScrapedData(rapidApiData, position);
      
      return new Response(
        JSON.stringify({
          message: 'Using data from Active Jobs DB API',
          data: transformedJobs
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error('Error fetching from RapidAPI:', apiError);
      // Fall back to sample data on API error
      return new Response(
        JSON.stringify({
          message: 'Error with Active Jobs DB API, using sample data instead',
          data: getSampleJobs(position, 10),
          error: apiError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in job scraper function:', error);
    
    return new Response(
      JSON.stringify({
        message: 'Error occurred, using sample data',
        data: getSampleJobs('Product Manager', 10),
        error: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});

// Transform Active Jobs DB API data to match our job data structure
function transformScrapedData(apiData: any[], position: string): any[] {
  // Handle empty or invalid data
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    console.warn('No data received from RapidAPI or invalid data format');
    return [];
  }

  // Map the API data to our job structure
  return apiData.map((job: any, index: number) => {
    // Generate random values for fields not provided by the API
    const connectionTypes: ["None", "Second", "First", "Alumni"] = ["None", "Second", "First", "Alumni"];
    const connectionType = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
    const industries = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Education", "Media"];
    const experiences = ["Entry Level", "Mid Level", "Senior", "Executive"];
    const jobType = ["Remote", "Onsite", "Hybrid"][Math.floor(Math.random() * 3)];
    
    return {
      id: job.id || `scraped-${index + 1}`.padStart(10, '0'),
      title: job.title || 'Job Title Not Available',
      company: job.company_name || 'Company Not Available',
      location: job.location || 'Remote',
      type: jobType,
      salary: job.salary_range || 'Salary not specified',
      logo: job.company_logo || `https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64`,
      position: position,
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      connection: {
        type: connectionType as any,
        name: connectionType !== 'None' ? `Connection ${index}` : undefined,
        position: connectionType !== 'None' ? 'Team Member' : undefined
      },
      applicationRate: Math.floor(Math.random() * 40) + 50, // Random rate between 50-90%
      featured: Math.random() > 0.7, // Randomly set some jobs as featured
      posted: job.posted_at || new Date().toISOString(),
      description: job.description || 'No description available',
      responsibilities: [
        "Drive product strategy and roadmap",
        "Collaborate with cross-functional teams",
        "Analyze market trends and user feedback",
        "Define product requirements and specifications",
        "Monitor product performance metrics"
      ],
      requirements: [
        "Bachelor's degree in related field",
        "3+ years of relevant experience",
        "Strong analytical and problem-solving skills",
        "Excellent communication abilities",
        "Familiarity with agile methodologies"
      ],
      recruiterActivity: Math.floor(Math.random() * 10) + 1,
    };
  });
}

// Sample jobs data function to use when RapidAPI is not available
function getSampleJobs(position: string, limit = 10) {
  const jobDescriptions = {
    'Product Manager': 'Leading product development initiatives and defining product strategy.',
    'Program Manager': 'Overseeing multiple projects and ensuring strategic alignment across initiatives.',
    'Project Manager': 'Managing project timelines, resources, and deliverables to ensure successful completion.',
    'Business Analyst': 'Analyzing business processes and identifying opportunities for improvement.',
    'Data Analyst': 'Interpreting data sets to provide actionable insights for business decisions.'
  };

  const sampleCompanies = [
    { name: 'TechVision Inc.', logo: 'https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64' },
    { name: 'InnovateSoft', logo: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64' },
    { name: 'DataDriven Co.', logo: 'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64' },
    { name: 'FutureTech', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64' },
    { name: 'GlobalSystems', logo: 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64' }
  ];

  const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Remote'];
  const jobTypes = ['Remote', 'Onsite', 'Hybrid'];
  const salaryRanges = ['$90,000 - $120,000', '$120,000 - $150,000', '$80,000 - $100,000', '$130,000 - $160,000'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Media'];
  const experiences = ['Entry Level', 'Mid Level', 'Senior', 'Executive'];
  const connectionTypes: ["None", "Second", "First", "Alumni"] = ["None", "Second", "First", "Alumni"];
  
  const result = [];
  
  for (let i = 0; i < limit; i++) {
    const company = sampleCompanies[i % sampleCompanies.length];
    const connectionType = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
    const positionIndex = i % 3; // Vary the title a bit
    const titleVariants = [
      `Senior ${position}`,
      `${position}`,
      `Lead ${position}`
    ];
    
    result.push({
      id: `${position.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`.padStart(10, '0'),
      title: titleVariants[positionIndex],
      company: company.name,
      location: locations[i % locations.length],
      type: jobTypes[i % jobTypes.length],
      salary: salaryRanges[i % salaryRanges.length],
      logo: company.logo,
      position: position,
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      connection: {
        type: connectionType as any,
        name: connectionType !== 'None' ? `Connection ${i}` : undefined,
        position: connectionType !== 'None' ? 'Team Member' : undefined
      },
      applicationRate: Math.floor(Math.random() * 40) + 50,
      featured: Math.random() > 0.7,
      posted: new Date().toISOString(),
      description: jobDescriptions[position as keyof typeof jobDescriptions] || 'No description available',
      responsibilities: [
        "Drive product strategy and roadmap",
        "Collaborate with cross-functional teams",
        "Analyze market trends and user feedback",
        "Define product requirements and specifications",
        "Monitor product performance metrics"
      ],
      requirements: [
        "Bachelor's degree in related field",
        "3+ years of relevant experience",
        "Strong analytical and problem-solving skills",
        "Excellent communication abilities",
        "Familiarity with agile methodologies"
      ],
      recruiterActivity: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return result;
}
