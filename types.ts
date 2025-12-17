export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  SYSTEM = 'system',
}

export enum SenderType {
  CLIENT = 'client',
  AGENT = 'agent',
  AI = 'ai',
  SYSTEM = 'system',
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
  messages: Message[];
  unreadCount: number;
  status: 'active' | 'lead' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  lastActive: Date;
  progressStage: number; // 0-100
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