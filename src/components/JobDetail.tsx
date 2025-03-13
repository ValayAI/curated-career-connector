
import React from "react";
import { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Building,
  FileText,
  ArrowRight,
} from "lucide-react";
import ConnectionInsight from "./ConnectionInsight";

interface JobDetailProps {
  job: Job;
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const posted = new Date(job.posted);
  const formattedDate = posted.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="col-span-1 md:col-span-2 space-y-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/70 p-6 md:p-8 animate-scale-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-lg overflow-hidden bg-secondary flex items-center justify-center border border-gray-200/70">
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{job.title}</h1>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center">
                <Briefcase size={12} className="mr-1" />
                Position
              </span>
              <span className="text-sm font-medium">{job.position}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center">
                <MapPin size={12} className="mr-1" />
                Location
              </span>
              <span className="text-sm font-medium">{job.location}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center">
                <Calendar size={12} className="mr-1" />
                Posted
              </span>
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center">
                <Clock size={12} className="mr-1" />
                Type
              </span>
              <Badge variant="outline" className="w-fit bg-secondary/50 border-none">
                {job.type}
              </Badge>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Overview</h2>
            <p className="text-muted-foreground">{job.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 h-12">
              Apply Now
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button variant="outline" className="h-12 px-6">
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="col-span-1 space-y-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <ConnectionInsight job={job} />

        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/70 p-6">
          <h3 className="text-lg font-medium mb-4">Job Details</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Salary Range</p>
              <p className="font-medium">{job.salary}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Experience</p>
              <p className="font-medium">{job.experience}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Industry</p>
              <p className="font-medium">{job.industry}</p>
            </div>

            {job.deadline && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Application Deadline</p>
                <p className="font-medium">
                  {new Date(job.deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText size={16} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium">Premium Resume Match</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Our AI has analyzed this job description and can tailor your resume to
            increase your match score by up to 40%.
          </p>

          <Button className="w-full" variant="outline">
            Optimize Resume
            <span className="ml-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-sm">PRO</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
