
import React from "react";
import { User, Building, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Job, ConnectionStrength } from "@/lib/types";

interface ConnectionInsightProps {
  job: Job;
}

const ConnectionInsight: React.FC<ConnectionInsightProps> = ({ job }) => {
  // Get company name, with fallback for when it's not available
  const companyName = job.company || "This company";
  
  if (job.connection.type === "None") {
    return (
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-gray-200/70">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Connection Insights</h3>
          <Badge connection={job.connection.type} />
        </div>
        <p className="text-muted-foreground mb-6">
          You don't have any direct connections at {companyName}. Upgrade to ConnectLeads Premium to find potential common connections who might help you get referred.
        </p>
        <Button className="w-full">
          Unlock Premium Insights
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-gray-200/70">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Connection Insights</h3>
        <Badge connection={job.connection.type} />
      </div>
      
      {job.connection.name && (
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
            <User size={24} />
          </div>
          <div>
            <h4 className="font-medium">{job.connection.name}</h4>
            <p className="text-sm text-muted-foreground">
              {job.connection.position} at {companyName}
            </p>
            <p className="mt-2 text-sm">
              {job.connection.type === "First"
                ? "You're directly connected with this person! They could help you get noticed."
                : job.connection.type === "Second"
                ? "You share a mutual connection with this person. Request an introduction!"
                : "You both attended the same school/company. Mention this in your application!"}
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-secondary/50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building size={18} className="text-muted-foreground" />
          <h4 className="font-medium">Company Insights</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          This position has a {job.applicationRate}% response rate, which is{" "}
          {job.applicationRate > 70 ? "higher" : "lower"} than average.
          Recruiter activity level is {job.recruiterActivity}/10.
        </p>
      </div>
      
      <Button className="w-full">
        Request Introduction
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </Card>
  );
};

interface BadgeProps {
  connection: ConnectionStrength;
}

const Badge: React.FC<BadgeProps> = ({ connection }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-700";
  let label = "No Connection";
  
  switch (connection) {
    case "First":
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      label = "1st Connection";
      break;
    case "Second":
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      label = "2nd Connection";
      break;
    case "Alumni":
      bgColor = "bg-purple-50";
      textColor = "text-purple-700";
      label = "Alumni Connection";
      break;
  }
  
  return (
    <div className={`rounded-full px-2.5 py-1 text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </div>
  );
};

export default ConnectionInsight;
