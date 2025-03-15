import React, { useState } from "react";
import { Filter, Experience, Industry, JobPosition, ConnectionStrength } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Filter as FilterIcon, X } from "lucide-react";

interface JobFilterProps {
  onFilterChange: (filter: Partial<Filter>) => void;
}

const JobFilter: React.FC<JobFilterProps> = ({ onFilterChange }) => {
  const [filter, setFilter] = useState<Partial<Filter>>({
    position: [],
    experience: [],
    industry: [],
    type: [],
    connectionStrength: [],
    minRecruiterActivity: 0,
    minApplicationRate: 0,
    location: "",
  });

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const positions: JobPosition[] = [
    "Product Manager",
    "Project Manager",
    "Program Manager",
    "Business Analyst",
  ];

  const experiences: Experience[] = [
    "Entry Level",
    "Mid Level",
    "Senior",
    "Executive",
  ];

  const industries: Industry[] = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Education",
    "Media",
  ];

  const jobTypes = ["Remote", "Onsite", "Hybrid"];
  
  const connectionTypes: ConnectionStrength[] = [
    "First",
    "Second",
    "Alumni",
    "None",
  ];

  const handlePositionChange = (position: JobPosition) => {
    setFilter((prev) => {
      const positions = prev.position || [];
      const newPositions = positions.includes(position)
        ? positions.filter((p) => p !== position)
        : [...positions, position];
      
      return { ...prev, position: newPositions };
    });
  };

  const handleExperienceChange = (experience: Experience) => {
    setFilter((prev) => {
      const experiences = prev.experience || [];
      const newExperiences = experiences.includes(experience)
        ? experiences.filter((e) => e !== experience)
        : [...experiences, experience];
      
      return { ...prev, experience: newExperiences };
    });
  };

  const handleIndustryChange = (industry: Industry) => {
    setFilter((prev) => {
      const industries = prev.industry || [];
      const newIndustries = industries.includes(industry)
        ? industries.filter((i) => i !== industry)
        : [...industries, industry];
      
      return { ...prev, industry: newIndustries };
    });
  };

  const handleTypeChange = (type: "Remote" | "Onsite" | "Hybrid") => {
    setFilter((prev) => {
      const types = prev.type || [];
      const newTypes = types.includes(type)
        ? types.filter((t) => t !== type)
        : [...types, type];
      
      return { ...prev, type: newTypes };
    });
  };

  const handleConnectionChange = (connection: ConnectionStrength) => {
    setFilter((prev) => {
      const connections = prev.connectionStrength || [];
      const newConnections = connections.includes(connection)
        ? connections.filter((c) => c !== connection)
        : [...connections, connection];
      
      return { ...prev, connectionStrength: newConnections };
    });
  };

  const handleRecruiterActivityChange = (value: number[]) => {
    setFilter((prev) => ({ ...prev, minRecruiterActivity: value[0] }));
  };

  const handleApplicationRateChange = (value: number[]) => {
    setFilter((prev) => ({ ...prev, minApplicationRate: value[0] }));
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
  };

  const handleLocationSearch = () => {
    setFilter((prev) => ({ ...prev, location: locationInput }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  const handleApplyFilter = () => {
    onFilterChange(filter);
  };

  const handleClearFilter = () => {
    setFilter({
      position: [],
      experience: [],
      industry: [],
      type: [],
      connectionStrength: [],
      minRecruiterActivity: 0,
      minApplicationRate: 0,
      location: "",
    });
    setLocationInput("");
    onFilterChange({});
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.position?.length) count += filter.position.length;
    if (filter.experience?.length) count += filter.experience.length;
    if (filter.industry?.length) count += filter.industry.length;
    if (filter.type?.length) count += filter.type.length;
    if (filter.connectionStrength?.length) count += filter.connectionStrength.length;
    if (filter.minRecruiterActivity && filter.minRecruiterActivity > 0) count += 1;
    if (filter.minApplicationRate && filter.minApplicationRate > 0) count += 1;
    return count;
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Filter Jobs</h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="text-muted-foreground"
          >
            {isFilterExpanded ? (
              <>
                <X size={16} className="mr-1" /> Collapse
              </>
            ) : (
              <>
                <FilterIcon size={16} className="mr-1" /> Expand
              </>
            )}
          </Button>
        </div>
        
        {getActiveFilterCount() > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium mr-1">
              {getActiveFilterCount()}
            </span>
            active filters
          </div>
        )}
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFilterExpanded ? 'max-h-[1500px]' : 'max-h-0'}`}>
        <div className="p-4 grid gap-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Location</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter location..."
                value={locationInput}
                onChange={handleLocationInputChange}
                onKeyPress={handleKeyPress}
                className="bg-muted/30 w-full rounded-lg border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {filter.location && (
                <div className="mt-2 flex items-center">
                  <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                    {filter.location}
                    <button 
                      onClick={() => {
                        setFilter(prev => ({ ...prev, location: "" }));
                        setLocationInput("");
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Role</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {positions.map((position) => (
                <div key={position} className="flex items-center space-x-2">
                  <Checkbox
                    id={`position-${position}`}
                    checked={filter.position?.includes(position) || false}
                    onCheckedChange={() => handlePositionChange(position)}
                  />
                  <Label htmlFor={`position-${position}`} className="text-sm cursor-pointer">
                    {position}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Experience Level</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {experiences.map((experience) => (
                <div key={experience} className="flex items-center space-x-2">
                  <Checkbox
                    id={`experience-${experience}`}
                    checked={filter.experience?.includes(experience) || false}
                    onCheckedChange={() => handleExperienceChange(experience)}
                  />
                  <Label htmlFor={`experience-${experience}`} className="text-sm cursor-pointer">
                    {experience}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Industry</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {industries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={filter.industry?.includes(industry) || false}
                    onCheckedChange={() => handleIndustryChange(industry)}
                  />
                  <Label htmlFor={`industry-${industry}`} className="text-sm cursor-pointer">
                    {industry}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Job Type</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {jobTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filter.type?.includes(type as "Remote" | "Onsite" | "Hybrid") || false}
                    onCheckedChange={() => handleTypeChange(type as "Remote" | "Onsite" | "Hybrid")}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Connection</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {connectionTypes.map((connection) => (
                <div key={connection} className="flex items-center space-x-2">
                  <Checkbox
                    id={`connection-${connection}`}
                    checked={filter.connectionStrength?.includes(connection) || false}
                    onCheckedChange={() => handleConnectionChange(connection)}
                  />
                  <Label htmlFor={`connection-${connection}`} className="text-sm cursor-pointer">
                    {connection} {connection !== "None" ? "Connection" : ""}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Minimum Recruiter Activity</h4>
              <span className="text-sm font-medium">{filter.minRecruiterActivity || 0}</span>
            </div>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[filter.minRecruiterActivity || 0]}
              onValueChange={handleRecruiterActivityChange}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">Low</span>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Minimum Application Response Rate</h4>
              <span className="text-sm font-medium">{filter.minApplicationRate || 0}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[filter.minApplicationRate || 0]}
              onValueChange={handleApplicationRateChange}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">0%</span>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex space-x-2 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={handleClearFilter} className="flex-1">
            Clear Filters
          </Button>
          <Button onClick={handleApplyFilter} size="sm" className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
      
      <div className={`p-4 ${isFilterExpanded ? 'border-t border-gray-100' : ''}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={locationInput}
            onChange={handleLocationInputChange}
            onKeyPress={handleKeyPress}
            className="bg-muted/30 w-full rounded-lg border border-input px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-md"
            onClick={handleLocationSearch}
          >
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobFilter;
