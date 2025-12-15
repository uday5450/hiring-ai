export type AspectRatio = '1:1' | '9:16' | '16:9' | '3:4';

export interface JobDetails {
  jobTitle: string;
  department: string;
  experience: string;
  responsibilities: string;
  skills: string;
  companyName: string;
  location: string;
  email?: string;
  mobileNo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  aspectRatio?: AspectRatio;
}