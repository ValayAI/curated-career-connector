
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { corsHeaders } from '../_shared/cors.ts'

// This endpoint allows us to fetch job listings from LinkedIn

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get the LinkedIn API credentials from environment variables
  const LINKEDIN_CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID')
  const LINKEDIN_CLIENT_SECRET = Deno.env.get('LINKEDIN_CLIENT_SECRET')

  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    return new Response(
      JSON.stringify({ error: 'LinkedIn API credentials not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }

  try {
    // Get request parameters from the body instead of URL query parameters
    const { page = 1, limit = 10, keywords = '', location = '' } = await req.json()
    
    // First, get access token from LinkedIn
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('LinkedIn token error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with LinkedIn API' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Then use the token to fetch jobs from LinkedIn
    // Note: Using LinkedIn's Job Search API endpoint (adjust according to their actual API)
    const jobsUrl = new URL('https://api.linkedin.com/v2/jobSearch')
    if (keywords) jobsUrl.searchParams.set('keywords', keywords)
    if (location) jobsUrl.searchParams.set('location', location)
    jobsUrl.searchParams.set('start', ((page - 1) * limit).toString())
    jobsUrl.searchParams.set('count', limit.toString())

    const jobsResponse = await fetch(jobsUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      }
    })

    if (!jobsResponse.ok) {
      const errorText = await jobsResponse.text()
      console.error('LinkedIn jobs API error:', errorText)
      
      // If we can't get real data, provide sample data for demonstration
      console.log('Returning sample job data')
      
      // Import sample job data from the frontend app
      const { supabaseClient } = await import('../_shared/supabaseClient.ts')
      
      // Get sample data from our database if available
      const { data, error } = await supabaseClient
        .from('jobs')
        .select('*')
        .limit(limit)
        .range((page - 1) * limit, page * limit - 1)
      
      if (error) {
        console.error('Error fetching sample data:', error)
        // Return our hardcoded sample data as fallback
        return new Response(
          JSON.stringify({
            message: 'Using sample data as LinkedIn API is not available',
            data: getSampleJobs(limit)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({
          message: 'Using database sample data as LinkedIn API is not available',
          data: data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const jobsData = await jobsResponse.json()
    
    return new Response(
      JSON.stringify(jobsData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in LinkedIn jobs function:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Sample jobs data function to use when LinkedIn API is not available
function getSampleJobs(limit = 10) {
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
      posted: new Date().toISOString()
    },
    {
      id: "linkedin-002",
      title: "UX/UI Designer",
      company: "Creative Solutions",
      location: "New York, NY",
      type: "Remote",
      salary: "$90,000 - $120,000",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=64&w=64",
      position: "Product Manager",
      experience: "Mid Level",
      industry: "Media",
      connection: {
        type: "First",
        name: "Sarah Johnson",
        position: "Design Director"
      },
      applicationRate: 65,
      featured: false,
      posted: new Date().toISOString()
    }
  ]

  // Return requested number of sample jobs (with duplicates if needed)
  const result = []
  for (let i = 0; i < limit; i++) {
    const job = {...sampleJobs[i % sampleJobs.length]}
    job.id = `linkedin-${i + 1}`.padStart(10, '0')
    result.push(job)
  }
  
  return result
}
