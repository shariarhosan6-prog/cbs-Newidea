export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  SYSTEM = 'system',
}

export enum SenderType {
  CLIENT = 'client', // The Student or Sub-Agent
  AGENT = 'agent',   // You (The Mediator)
  SUPER_AGENT = 'super_agent', // The Upstream RTO/Master Agent
  AI = 'ai',
  SYSTEM = 'system',
}

export type LeadSource = 'direct' | 'sub_agent';
export type MessageThread = 'source' | 'upstream'; // 'source' = Student/Sub-agent, 'upstream' = Super Agent

export interface Message {
  id: string;
  sender: SenderType;
  type: MessageType;
  content: string;
  timestamp: Date;
  fileName?: string;
  fileSize?: string;
  read?: boolean;
  thread: MessageThread; // New field to segregate chats
}

export interface DocumentStatus {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'missing' | 'rejected';
  uploadDate?: Date;
  confidence?: number;
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

export interface QuickReply {
  id: string;
  label: string;
  text: string;
}