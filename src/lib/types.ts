
export type JobPosition = 
  | 'Product Manager'
  | 'Project Manager'
  | 'Program Manager'
  | 'Business Analyst';

export type Experience = 
  | 'Entry Level'
  | 'Mid Level'
  | 'Senior'
  | 'Executive';
  
export type Industry =
  | 'Technology'
  | 'Healthcare'
  | 'Finance'
  | 'Retail'
  | 'Manufacturing'
  | 'Education'
  | 'Media';

export type ConnectionStrength = 
  | 'None'
  | 'Second'
  | 'First'
  | 'Alumni';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'Onsite' | 'Hybrid';
  salary: string;
  logo: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  posted: string; // ISO date string
  deadline?: string; // ISO date string
  position: JobPosition;
  experience: Experience;
  industry: Industry;
  recruiterActivity: number; // 1-10 scale of engagement
  connection: {
    type: ConnectionStrength;
    name?: string;
    position?: string;
  };
  applicationRate: number; // Percentage of applications that receive a response
  featured: boolean;
}

export interface Filter {
  position: JobPosition[];
  experience: Experience[];
  industry: Industry[];
  type: ('Remote' | 'Onsite' | 'Hybrid')[];
  connectionStrength: ConnectionStrength[];
  minRecruiterActivity?: number;
  minApplicationRate?: number;
  location?: string; // Added location property
}
