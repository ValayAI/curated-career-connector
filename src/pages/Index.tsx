
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Users, Filter, Sparkles } from 'lucide-react';
import { jobs } from '@/lib/data';
import JobCard from '@/components/JobCard';
import PremiumFeature from '@/components/PremiumFeature';

const Index = () => {
  const navigate = useNavigate();
  const featuredJobs = jobs.filter(job => job.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection />
      
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
                <JobCard job={job} />
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
