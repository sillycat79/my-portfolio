export interface Project {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  stack: string[];
  details: string;
  codeSnippet?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  achievements: string[];
}

export interface LeadershipExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  achievements: string[];
}

export type WindowType =
  | 'projects'
  | 'project_folder' // beginner, intermediate, advanced
  | 'project_details'
  | 'about'
  | 'experience'
  | 'school'
  | 'paint'
  | 'music'
  | 'cat_flap'
  | 'socials'
  | 'read_me';

export interface AppWindow {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: WindowType;
  meta?: any; // To hold custom dynamic metadata, like active difficulty level or active project object
}
