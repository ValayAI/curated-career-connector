
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import JobFilter from "@/components/JobFilter";
import { Filter, Job, ConnectionStrength, JobPosition } from "@/lib/types";
import { filterJobs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ALLOWED_POSITIONS: JobPosition[] = [
  'Product Manager',
  'Program Manager',
  'Project Manager',
  'Business Analyst',
  'Data Analyst'
];

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [activeFilter, setActiveFilter] = useState<Partial<Filter>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [apiSource, setApiSource] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition>('Product Manager');

  const fetchJobs = async (pageNum = 1, position = selectedPosition) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supabase.functions.invoke('job-scraper', {
        body: {
          position: position,
          location: activeFilter.location || '',
        }
      });

      if (response.error) {
        console.error('Error invoking edge function:', response.error);
        toast.error('Failed to load jobs. Using sample data instead.');
        setError('Edge Function Error: ' + response.error.message);
        
        const localFilteredJobs = filterJobs(activeFilter);
        if (pageNum === 1) {
          setJobs(localFilteredJobs);
          setFilteredJobs(localFilteredJobs);
        }
        setHasMore(false);
        setApiSource('Local sample data (edge function error)');
      } else {
        const responseData = response.data;
        const jobsData = responseData.data || [];
        setApiSource(responseData.message || 'API data');
        
        if (responseData.error) {
          setError('API returned an error: ' + responseData.error);
          toast.error('API error: ' + responseData.error);
        }
        
        const formattedJobs = jobsData
          .map((job: any) => ({
            ...job,
            id: job.id || `job-${Math.random().toString(36).substr(2, 9)}`,
            featured: job.featured ?? Math.random() > 0.7,
            applicationRate: job.applicationRate || Math.floor(Math.random() * 40) + 50,
            connection: job.connection || { 
              type: ['None', 'Second', 'First', 'Alumni'][Math.floor(Math.random() * 4)] as ConnectionStrength
            },
            description: job.description || "No description provided",
            responsibilities: job.responsibilities || ["Responsibility information not available"],
            requirements: job.requirements || ["Requirement information not available"],
            recruiterActivity: job.recruiterActivity || Math.floor(Math.random() * 10) + 1,
            position: job.position || position,
          }))
          .filter((job: Job) => ALLOWED_POSITIONS.includes(job.position));

        if (pageNum === 1) {
          setJobs(formattedJobs);
          setFilteredJobs(formattedJobs);
        } else {
          setJobs(prev => [...prev, ...formattedJobs]);
          setFilteredJobs(prev => [...prev, ...formattedJobs]);
        }
        
        setHasMore(formattedJobs.length >= 10);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setError('Failed to load jobs: ' + (error instanceof Error ? error.message : String(error)));
      
      const localFilteredJobs = filterJobs(activeFilter);
      if (pageNum === 1) {
        setJobs(localFilteredJobs);
        setFilteredJobs(localFilteredJobs);
      }
      setHasMore(false);
      setApiSource('Local sample data (error fallback)');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedPosition]);

  const handleFilterChange = (filter: Partial<Filter>) => {
    setActiveFilter(filter);
    setPage(1);
    
    if (Object.keys(filter).length === 0) {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => {
        let matches = true;
        
        Object.entries(filter).forEach(([key, value]) => {
          if (key === 'minRecruiterActivity' || key === 'minApplicationRate') {
            if (typeof value === 'number' && value > 0) {
              const jobValue = job[key.replace('min', '') as keyof Job];
              if (typeof jobValue === 'number' && jobValue < value) {
                matches = false;
              }
            }
          } else if (key === 'connectionStrength' && Array.isArray(value) && value.length > 0) {
            const connectionStrengths = value as ConnectionStrength[];
            if (!connectionStrengths.includes(job.connection.type)) {
              matches = false;
            }
          } else if (Array.isArray(value) && value.length > 0) {
            const jobValue = job[key as keyof Job];
            const typedValue = value as string[];
            if (jobValue && !typedValue.includes(jobValue as string)) {
              matches = false;
            }
          }
        });
        
        return matches;
      });
      
      setFilteredJobs(filtered);
    }
  };

  const loadMoreJobs = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage);
  };

  const handlePositionChange = (position: JobPosition) => {
    setSelectedPosition(position);
    setPage(1);
    fetchJobs(1, position);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="py-20">
        <div className="container px-4 md:px-6 pt-10">
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              <Briefcase size={14} className="mr-1" />
              Job Opportunities
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Browse curated jobs</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Focus on quality over quantity with jobs that match your profile and have higher response rates.
            </p>
            {apiSource && (
              <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center">
                <span>Source: {apiSource}</span>
                {error && (
                  <div className="ml-2 flex items-center text-destructive">
                    <AlertCircle size={12} className="mr-1" />
                    <button 
                      className="text-xs underline hover:no-underline truncate max-w-[300px]" 
                      title={error}
                      onClick={() => toast.error(error || "Unknown error")}
                    >
                      Error detected (click for details)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mb-8 animate-fade-up">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
              <h2 className="font-medium text-lg mb-3">Select Job Position</h2>
              <div className="flex flex-wrap gap-2">
                {ALLOWED_POSITIONS.map((position) => (
                  <Button
                    key={position}
                    variant={selectedPosition === position ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePositionChange(position)}
                    className="transition-all"
                  >
                    {position}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 animate-fade-in">
              <div className="sticky top-20">
                <JobFilter onFilterChange={handleFilterChange} />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-6 animate-fade-up">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredJobs.length}</span> job opportunities
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <select className="text-sm border border-input rounded-md px-2 py-1">
                      <option>Best Match</option>
                      <option>Date Posted</option>
                      <option>Connection Strength</option>
                      <option>Response Rate</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {isLoading && page === 1 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center animate-fade-up">
                  <Loader2 size={40} className="mx-auto text-primary mb-4 animate-spin" />
                  <h3 className="text-xl font-medium mb-2">Loading jobs...</h3>
                  <p className="text-muted-foreground">Fetching the latest {selectedPosition} positions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center animate-fade-up">
                      <Briefcase size={40} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results.</p>
                      <Button onClick={() => setActiveFilter({})}>
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <div key={job.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <JobCard job={job} />
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {filteredJobs.length > 0 && hasMore && (
                <div className="mt-8 flex justify-center animate-fade-up">
                  <Button 
                    variant="outline" 
                    className="rounded-full px-8"
                    onClick={loadMoreJobs}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      <>
                        Load more jobs
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Briefcase size={20} className="text-primary mr-2" />
              <span className="text-lg font-medium">ConnectLeads</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2023 ConnectLeads. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Jobs;
