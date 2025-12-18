
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

// Added ApplicationType for pipeline switching
export type ApplicationType = 'rpl' | 'admission';

// Expanded ApplicationStage to include both RPL and University Admission stages
export type ApplicationStage = 
  | 'lead' 
  | 'evidence_collection' 
  | 'mediator_review' 
  | 'rto_submission' 
  | 'certified'
  | 'app_lodged'
  | 'conditional_offer'
  | 'gte_assessment'
  | 'coe_issued';

export interface ApplicationCard {
  id: string;
  type: ApplicationType; // Added to distinguish between pipelines
  clientName: string; // Renamed from name to match usage in Kanban component
  qualification: string;
  stage: ApplicationStage;
  tags: string[];
  source?: string;
  value: string;
  lastUpdate?: Date;
  daysInStage: number;
  missingDocs: number;
  counselor: string;
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

// FINANCE TYPES
export type TransactionType = 'incoming' | 'outgoing_sub_agent' | 'outgoing_staff';
export type TransactionStatus = 'pending' | 'paid' | 'overdue';

export interface CommissionRecord {
    id: string;
    clientId: string;
    clientName: string;
    description: string; // e.g., "Commission from StudyPath RTO"
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    dueDate: Date;
    relatedEntityName: string; // Name of Sub-Agent or Counselor or RTO
}

export interface Counselor {
    id: string;
    name: string;
    avatar: string;
    totalSales: number;
    commissionEarned: number;
    activeDeals: number;
}
