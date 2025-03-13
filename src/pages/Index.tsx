import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Users, Filter, Sparkles, ExternalLink, MapPin } from 'lucide-react';
import { jobs } from '@/lib/data';
import PremiumFeature from '@/components/PremiumFeature';
import { ContainerScroll } from '@/components/ContainerScroll';

const Index = () => {
  const navigate = useNavigate();
  const featuredJobs = jobs.filter(job => job.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-fade-down">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI-powered job connections for PM professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight animate-fade-up">
              Transform your job search with high-quality{" "}
              <span className="text-primary relative">
                warm leads
                <svg
                  className="absolute -bottom-1 left-0 w-full h-[8px] text-primary/30"
                  viewBox="0 0 300 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C67 1.5 179 1.5 299 5.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "100ms" }}>
              Intelligent matching for Product, Project, Program Managers, and Business Analysts. Focus on opportunities where you have a connection advantage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Button 
                onClick={() => navigate("/jobs")}
                className="h-14 px-8 rounded-xl text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Find your next role
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>

            <div className="pt-16 flex flex-col items-center animate-fade-up" style={{ animationDelay: "300ms" }}>
              <p className="text-sm font-medium text-foreground/60 mb-6">TRUSTED BY PROFESSIONALS FROM</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-items-center items-center">
                {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'LinkedIn'].map((company) => (
                  <div key={company} className="text-foreground/40 font-semibold text-lg">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-2 h-full p-4 md:py-8 md:px-4 overflow-y-auto">
          {featuredJobs.map((job) => (
            <div 
              key={job.id} 
              className="flex flex-col sm:flex-row items-center p-4 rounded-xl bg-[#FEF7CD] hover:bg-[#FEF7CD]/80 cursor-pointer transition-colors duration-200 animate-fade-up"
              style={{ animationDelay: `${featuredJobs.indexOf(job) * 100}ms` }}
              onClick={() => navigate(`/job/${job.id}`)}
            >
              <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 mr-4 bg-white flex items-center justify-center">
                <img src={job.logo} alt={`${job.company} logo`} className="h-10 w-10 object-contain" />
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title} • {job.company}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-1">
                      <span>{job.position}</span>
                      <span className="inline-block h-1 w-1 rounded-full bg-gray-500"></span>
                      {job.type === "Remote" ? (
                        <span>Worldwide</span>
                      ) : (
                        <span>{job.location}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:mt-0">
                    <span className="text-sm font-medium text-gray-800">{job.salary}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContainerScroll>
      
      <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              <Briefcase size={14} className="mr-1" />
              Featured Opportunities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Curated for your success</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We prioritize quality over quantity. Focus on jobs where you have a connection advantage and higher response rates.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredJobs.map((job) => (
              <div key={job.id} className="animate-fade-up" style={{ animationDelay: `${featuredJobs.indexOf(job) * 100}ms` }}>
                <div 
                  className="relative border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:bg-white/80 cursor-pointer group overflow-hidden"
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  {job.featured && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                  )}
                  
                  {job.connection && job.connection.type && (
                    <div className="absolute top-4 right-4">
                      <div className={`bg-${job.connection.type === 'First' ? 'green' : job.connection.type === 'Second' ? 'blue' : 'purple'}-50 text-${job.connection.type === 'First' ? 'green' : job.connection.type === 'Second' ? 'blue' : 'purple'}-600 border-${job.connection.type === 'First' ? 'green' : job.connection.type === 'Second' ? 'blue' : 'purple'}-200 px-2 py-1 rounded-full text-xs font-medium flex items-center`}>
                        <Users size={12} className="mr-1" />
                        {job.connection.type === 'First' ? '1st' : job.connection.type === 'Second' ? '2nd' : 'Alumni'} Connection
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-secondary flex items-center justify-center border border-border/40">
                        <img src={job.logo} alt={`${job.company} logo`} className="h-full w-full object-cover" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-200">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Briefcase size={14} className="mr-1.5" />
                            <span>{job.position}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowRight size={14} className="mr-1.5" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">{job.applicationRate}%</span>
                          <span className="text-muted-foreground ml-1">response rate</span>
                        </div>
                        
                        <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                          View Details
                          <ExternalLink size={14} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Button onClick={() => navigate("/jobs")} variant="outline" className="rounded-full px-8">
              View all opportunities
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-4">
              <Sparkles size={14} className="mr-1" />
              Our Approach
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How ConnectLeads works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We analyze thousands of job postings to find the perfect match for your skills and connections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="flex flex-col items-center text-center animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Filter size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Intelligent Filtering</h3>
              <p className="text-muted-foreground">
                Our AI analyzes thousands of job postings to match your skills with the right opportunities.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Connection Insights</h3>
              <p className="text-muted-foreground">
                Discover jobs where you have network advantages through mutual connections or shared backgrounds.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Premium Tools</h3>
              <p className="text-muted-foreground">
                Access AI-powered resume tailoring, interview preparation, and personalized application strategies.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Button variant="default" className="rounded-full px-8">
              Learn more about our approach
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              <Sparkles size={14} className="mr-1" />
              Premium Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Boost your job search success</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Unlock powerful tools designed to give you an edge in competitive job markets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="animate-fade-up">
              <PremiumFeature
                title="AI Resume Optimizer"
                description="Automatically tailor your resume to match job descriptions and maximize your match score."
                icon={<FileIcon />}
              />
            </div>
            
            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <PremiumFeature
                title="Connection Insights"
                description="Discover mutual connections and get personalized introduction strategies."
                icon={<Users size={24} />}
                highlighted
              />
            </div>
            
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <PremiumFeature
                title="Response Predictions"
                description="See which jobs are most likely to respond based on your profile and application."
                icon={<ChartIcon />}
              />
            </div>
          </div>
          
          <div className="flex justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Button variant="default" className="rounded-full px-8">
              Explore all premium features
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
      
      <footer className="bg-white border-t border-gray-200">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Features</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Pricing</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">How It Works</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Premium</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Guides</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Career Advice</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">LinkedIn</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Instagram</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Email</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
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

// Helper icons
const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

export default Index;
