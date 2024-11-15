export interface Service {
  id: string;
  name: string;
  projectName: string;
  url: string;
  ip: string;
  description: string;
  cloudProvider: string;
  monthlyCost: number;
  supportedBy: string;
  lastCheck: Date;
  isActive: boolean;
}