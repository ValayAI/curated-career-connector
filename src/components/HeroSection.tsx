
import React from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20 pb-32">
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
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
            <Button 
              variant="outline" 
              className="h-14 px-8 rounded-xl text-base border-gray-300 hover:bg-secondary/50 transition-all duration-300"
            >
              <Search size={18} className="mr-2" />
              Explore job matches
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
      </div>
    </section>
  );
};

export default HeroSection;
