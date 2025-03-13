
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import JobFilter from "@/components/JobFilter";
import { Filter, Job } from "@/lib/types";
import { jobs, filterJobs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

const Jobs = () => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [activeFilter, setActiveFilter] = useState<Partial<Filter>>({});

  const handleFilterChange = (filter: Partial<Filter>) => {
    setActiveFilter(filter);
    setFilteredJobs(filterJobs(filter));
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
              
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-12 text-center animate-fade-up">
                    <Briefcase size={40} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results.</p>
                    <Button onClick={() => handleFilterChange({})}>
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
              
              {filteredJobs.length > 0 && (
                <div className="mt-8 flex justify-center animate-fade-up">
                  <Button variant="outline" className="rounded-full px-8">
                    Load more jobs
                    <ArrowRight size={16} className="ml-2" />
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
