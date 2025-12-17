export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  SYSTEM = 'system',
}

export enum SenderType {
  CLIENT = 'client', 
  AGENT = 'agent',   
  SUPER_AGENT = 'super_agent',
  AI = 'ai',
  SYSTEM = 'system',
}

export type LeadSource = 'direct' | 'sub_agent';
export type MessageThread = 'source' | 'upstream'; 

// CRM specific types
export type ViewState = 'dashboard' | 'pipeline' | 'inbox' | 'partners' | 'finance';

export type ApplicationStage = 'lead' | 'evidence_collection' | 'mediator_review' | 'rto_submission' | 'certified';

export interface ApplicationCard {
  id: string;
  clientName: string;
  avatar: string;
  qualification: string;
  stage: ApplicationStage;
  source: string;
  value: number;
  lastUpdate: Date;
  missingDocs: number;
}

export interface DashboardStats {
  totalRevenue: number;
  activeApplications: number;
  pendingCommissions: number;
  conversionRate: number;
}

export interface Message {
  id: string;
  sender: SenderType;
  type: MessageType;
  content: string;
  timestamp: Date;
  fileName?: string;
  fileSize?: string;
  read?: boolean;
  thread: MessageThread;
}

export interface DocumentStatus {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'missing' | 'rejected';
  uploadDate?: Date;
  confidence?: number;
}

export interface EducationEntry {
  id: string;
  level: 'Year 10' | 'Year 12' | 'Diploma' | 'Bachelor' | 'Masters' | 'PhD';
  institution: string;
  startYear: number;
  endYear: number;
  isGapFiller?: boolean; // If true, this is work experience filling a gap
}

export interface ClientProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  visaStatus: string;
  visaExpiry: string;
  qualificationTarget: string;
  experienceYears: number;
  educationHistory: EducationEntry[]; // New field for Gap Analysis
}

export interface Conversation {
  id: string;
  client: ClientProfile;
  source: LeadSource;
  subAgentName?: string;
  superAgentStatus: 'not_started' | 'processing' | 'submitted' | 'accepted';
  messages: Message[];
  unreadCount: number;
  status: 'active' | 'lead' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  lastActive: Date;
  progressStage: number;
  currentStep: string;
  documents: DocumentStatus[];
  paymentTotal: number;
  paymentPaid: number;
}

export interface Partner {
  id: string;
  name: string;
  type: 'RTO' | 'Sub-Agent' | 'University';
  contactPerson: string;
  email: string;
  activeStudents: number;
  commissionRate: string; // e.g., "20%" or "$500 flat"
  status: 'active' | 'inactive';
  logo: string;
}