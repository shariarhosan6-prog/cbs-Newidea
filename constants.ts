import { Conversation, MessageType, SenderType } from './types';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    client: {
      id: 'u1',
      name: 'Sarah Jenkins',
      avatar: 'https://picsum.photos/seed/sarah/200/200',
      email: 'sarah.j@example.com',
      phone: '+61 400 123 456',
      location: 'Melbourne, VIC',
      visaStatus: 'Subclass 482',
      visaExpiry: '2024-11-15',
      qualificationTarget: 'Diploma of Project Management',
      experienceYears: 5,
    },
    source: 'direct',
    superAgentStatus: 'processing',
    unreadCount: 1,
    status: 'active',
    priority: 'high',
    lastActive: new Date(),
    progressStage: 60,
    currentStep: 'Mediator Review',
    paymentTotal: 2500,
    paymentPaid: 1250,
    documents: [
      { id: 'd1', name: 'Resume / CV', status: 'verified', uploadDate: new Date('2024-05-10'), confidence: 98 },
      { id: 'd2', name: 'Employment Reference 1', status: 'verified', uploadDate: new Date('2024-05-12'), confidence: 95 },
      { id: 'd3', name: 'Employment Reference 2', status: 'pending', uploadDate: new Date('2024-05-14'), confidence: 40 },
      { id: 'd4', name: 'Photo ID', status: 'verified', uploadDate: new Date('2024-05-01'), confidence: 99 },
      { id: 'd5', name: 'USI Transcript', status: 'missing' },
    ],
    messages: [
      // --- THREAD: SOURCE (Student) ---
      {
        id: 'm1',
        sender: SenderType.AGENT,
        type: MessageType.TEXT,
        content: "Hi Sarah! I'm reviewing your file before sending it to the main processing team.",
        timestamp: new Date(Date.now() - 86400000 * 2),
        read: true,
        thread: 'source'
      },
      {
        id: 'm3',
        sender: SenderType.SYSTEM,
        type: MessageType.SYSTEM,
        content: "Smart Checklist sent: 5 documents required.",
        timestamp: new Date(Date.now() - 86000000 * 2),
        read: true,
        thread: 'source'
      },
      {
        id: 'm4',
        sender: SenderType.CLIENT,
        type: MessageType.DOCUMENT,
        content: "Here is my updated CV.",
        fileName: "Sarah_Jenkins_CV_2024.pdf",
        fileSize: "1.2 MB",
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        thread: 'source'
      },
      
      // --- THREAD: UPSTREAM (Super Agent) ---
      {
        id: 'sa1',
        sender: SenderType.SUPER_AGENT,
        type: MessageType.TEXT,
        content: "Hey, we received the initial intake for Sarah Jenkins. Do you have the USI yet?",
        timestamp: new Date(Date.now() - 7200000),
        read: true,
        thread: 'upstream'
      },
      {
        id: 'sa2',
        sender: SenderType.AGENT,
        type: MessageType.TEXT,
        content: "Collecting it now. She just sent her CV. Will push full packet in 10 mins.",
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        thread: 'upstream'
      },
      {
        id: 'sa3',
        sender: SenderType.SUPER_AGENT,
        type: MessageType.TEXT,
        content: "Perfect. We have a spot in the next batch.",
        timestamp: new Date(Date.now() - 1800000),
        read: false,
        thread: 'upstream'
      },
    ],
  },
  {
    id: 'c2',
    client: {
      id: 'u2',
      name: 'Michael Chen',
      avatar: 'https://picsum.photos/seed/michael/200/200',
      email: 'm.chen@example.com',
      phone: '+61 411 987 654',
      location: 'Sydney, NSW',
      visaStatus: 'Student 500',
      visaExpiry: '2025-02-20',
      qualificationTarget: 'Cert IV in Commercial Cookery',
      experienceYears: 3,
    },
    source: 'sub_agent',
    subAgentName: 'Global Ed Consultancy',
    superAgentStatus: 'not_started',
    unreadCount: 0,
    status: 'lead',
    priority: 'medium',
    lastActive: new Date(Date.now() - 86400000),
    progressStage: 10,
    currentStep: 'Initial Assessment',
    paymentTotal: 3000,
    paymentPaid: 0,
    documents: [
      { id: 'd1', name: 'Passport', status: 'verified', uploadDate: new Date('2024-05-13'), confidence: 99 },
    ],
    messages: [
      {
        id: 'm0',
        sender: SenderType.SYSTEM,
        type: MessageType.SYSTEM,
        content: "Lead forwarded by Sub-Agent: Global Ed Consultancy",
        timestamp: new Date(Date.now() - 90000000),
        read: true,
        thread: 'source'
      },
      {
        id: 'm1',
        sender: SenderType.AGENT,
        type: MessageType.TEXT,
        content: "Hi Michael, Global Ed sent us your profile. Please upload your payslips so we can package this for the Super Agent.",
        timestamp: new Date(Date.now() - 86400000),
        read: true,
        thread: 'source'
      },
    ],
  },
  {
    id: 'c3',
    client: {
      id: 'u3',
      name: 'Elena Rodriguez',
      avatar: 'https://picsum.photos/seed/elena/200/200',
      email: 'elena.r@example.com',
      phone: '+61 422 333 444',
      location: 'Brisbane, QLD',
      visaStatus: 'Permanent Resident',
      visaExpiry: 'N/A',
      qualificationTarget: 'Diploma of Early Childhood Education',
      experienceYears: 7,
    },
    source: 'direct',
    superAgentStatus: 'submitted',
    unreadCount: 3,
    status: 'active',
    priority: 'low',
    lastActive: new Date(Date.now() - 7200000),
    progressStage: 80,
    currentStep: 'Super Agent Review',
    paymentTotal: 1800,
    paymentPaid: 1800,
    documents: [],
    messages: [],
  }
];

export const PROGRESS_STEPS = [
  'Intake', 'Doc Check', 'Mediator Verified', 'Super Agent', 'Complete'
];