
import { Conversation, MessageType, SenderType, Partner, CommissionRecord, Counselor } from './types';

export const MOCK_PARTNERS: Partner[] = [
    {
        id: 'p1',
        name: 'StudyPath RTO',
        type: 'RTO',
        contactPerson: 'David Ross',
        email: 'admissions@studypath.edu.au',
        activeStudents: 12,
        commissionRate: '25%',
        status: 'active',
        logo: 'https://ui-avatars.com/api/?name=Study+Path&background=6366f1&color=fff'
    },
    {
        id: 'p2',
        name: 'Global Ed Consultancy',
        type: 'Sub-Agent',
        contactPerson: 'Priya Kapoor',
        email: 'priya@globaled.com',
        activeStudents: 8,
        commissionRate: '15%',
        status: 'active',
        logo: 'https://ui-avatars.com/api/?name=Global+Ed&background=f59e0b&color=fff'
    },
    {
        id: 'p3',
        name: 'Melbourne Tech Institute',
        type: 'RTO',
        contactPerson: 'Admin Team',
        email: 'info@mti.edu.au',
        activeStudents: 4,
        commissionRate: '30%',
        status: 'active',
        logo: 'https://ui-avatars.com/api/?name=Melb+Tech&background=10b981&color=fff'
    },
    {
        id: 'p4',
        name: 'VisaFast Agency',
        type: 'Sub-Agent',
        contactPerson: 'John Li',
        email: 'john@visafast.com',
        activeStudents: 0,
        commissionRate: '15%',
        status: 'inactive',
        logo: 'https://ui-avatars.com/api/?name=Visa+Fast&background=94a3b8&color=fff'
    }
];

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
      educationHistory: [
          { id: 'e1', level: 'Year 12', institution: 'Melbourne High', startYear: 2014, endYear: 2015 },
          { id: 'e2', level: 'Bachelor', institution: 'RMIT University', startYear: 2016, endYear: 2019 },
          // GAP HERE: 2019 to 2022 (3 years gap)
          { id: 'e3', level: 'Masters', institution: 'Monash University', startYear: 2022, endYear: 2024 }
      ]
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
      { id: 'd4', name: 'Photo ID', status: 'verified', uploadDate: new Date('2024-05-01'), confidence: 99 },
      { id: 'd5', name: 'USI Transcript', status: 'missing' },
      // Added dynamically if gap found
      { id: 'd_gap', name: 'Gap Explanation (2019-2022)', status: 'missing' }
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
      educationHistory: [
         { id: 'e1', level: 'Year 12', institution: 'Beijing High', startYear: 2020, endYear: 2021 },
         { id: 'e2', level: 'Diploma', institution: 'Sydney TAFE', startYear: 2022, endYear: 2023 }
      ]
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
      educationHistory: []
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

export const MOCK_COMMISSIONS: CommissionRecord[] = [
    {
        id: 'tx1',
        clientId: 'u1',
        clientName: 'Sarah Jenkins',
        description: 'Commission from StudyPath RTO',
        amount: 800,
        type: 'incoming',
        status: 'pending',
        dueDate: new Date('2024-06-01'),
        relatedEntityName: 'StudyPath RTO'
    },
    {
        id: 'tx2',
        clientId: 'u2',
        clientName: 'Michael Chen',
        description: 'Sub-Agent Payout',
        amount: 300,
        type: 'outgoing_sub_agent',
        status: 'pending',
        dueDate: new Date('2024-06-05'),
        relatedEntityName: 'Global Ed Consultancy'
    },
    {
        id: 'tx3',
        clientId: 'u3',
        clientName: 'Elena Rodriguez',
        description: 'Counselor Incentive',
        amount: 150,
        type: 'outgoing_staff',
        status: 'paid',
        dueDate: new Date('2024-05-15'),
        relatedEntityName: 'Jessica Wu'
    },
    {
        id: 'tx4',
        clientId: 'u4',
        clientName: 'Raj Patel',
        description: 'Commission from Melb Tech',
        amount: 1200,
        type: 'incoming',
        status: 'paid',
        dueDate: new Date('2024-05-20'),
        relatedEntityName: 'Melbourne Tech Institute'
    }
];

export const MOCK_COUNSELORS: Counselor[] = [
    { id: 's1', name: 'Jessica Wu', avatar: 'https://ui-avatars.com/api/?name=Jessica+Wu&background=ffb6c1&color=fff', totalSales: 45000, commissionEarned: 4500, activeDeals: 12 },
    { id: 's2', name: 'Tom Hardy', avatar: 'https://ui-avatars.com/api/?name=Tom+Hardy&background=add8e6&color=fff', totalSales: 32000, commissionEarned: 3200, activeDeals: 8 },
    { id: 's3', name: 'Amanda Lee', avatar: 'https://ui-avatars.com/api/?name=Amanda+Lee&background=90ee90&color=fff', totalSales: 58000, commissionEarned: 5800, activeDeals: 15 },
    { id: 's4', name: 'David Kim', avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=f0e68c&color=fff', totalSales: 21000, commissionEarned: 2100, activeDeals: 5 },
];
