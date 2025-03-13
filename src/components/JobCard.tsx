
import React from "react";
import { Job } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User, Briefcase, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  const posted = new Date(job.posted);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - posted.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const getConnectionBadge = () => {
    switch (job.connection.type) {
      case "First":
        return (
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 px-2 py-1">
              <User size={12} className="mr-1" />
              1st Connection
            </Badge>
          </div>
        );
      case "Second":
        return (
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 px-2 py-1">
              <User size={12} className="mr-1" />
              2nd Connection
            </Badge>
          </div>
        );
      case "Alumni":
        return (
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 px-2 py-1">
              <User size={12} className="mr-1" />
              Alumni
            </Badge>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      className="relative border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:bg-white/80 cursor-pointer group overflow-hidden"
      onClick={() => navigate(`/job/${job.id}`)}
    >
      {job.featured && (
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      )}
      
      {getConnectionBadge()}
      
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
                <MapPin size={14} className="mr-1.5" />
                <span>{job.location}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Badge variant="outline" className="font-normal bg-secondary/50 border-none">
                  {job.type}
                </Badge>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={14} className="mr-1.5" />
                <span>{diffDays} {diffDays === 1 ? 'day' : 'days'} ago</span>
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
    </Card>
  );
};

export default JobCard;
