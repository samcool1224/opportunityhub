export interface Professor {
  id: string;
  name: string;
  title: string;
  institution: string;
  department: string;
  email: string;
  avatar: string;
  researchAreas: string[];
  bio: string;
  publications: number;
  citations: number;
  currentOpportunities: number;
  rating: number;
  verified: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  year: string;
  gpa: number;
  avatar: string;
  skills: string[];
  interests: string[];
  bio: string;
  portfolio: {
    projects: string[];
    publications: string[];
    awards: string[];
  };
  applicationCount: number;
  acceptanceRate: number;
}

export interface Opportunity {
  id: string;
  title: string;
  professor: Professor;
  description: string;
  requirements: string[];
  duration: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  compensation: string;
  applicationDeadline: string;
  postedDate: string;
  applicants: number;
  tags: string[];
  status: 'Open' | 'Closed' | 'Filled';
}

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
  appliedDate: string;
  coverLetter: string;
  documents: string[];
}

export const mockProfessors: Professor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Professor of Computer Science',
    institution: 'MIT',
    department: 'Computer Science & AI',
    email: 'sarah.chen@mit.edu',
    avatar: '/api/placeholder/150/150',
    researchAreas: ['Machine Learning', 'Computer Vision', 'AI Ethics'],
    bio: 'Dr. Chen leads groundbreaking research in ethical AI systems and computer vision applications for healthcare.',
    publications: 127,
    citations: 8452,
    currentOpportunities: 3,
    rating: 4.9,
    verified: true
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    title: 'Associate Professor of Biology',
    institution: 'Stanford University',
    department: 'Biological Sciences',
    email: 'mrodriguez@stanford.edu',
    avatar: '/api/placeholder/150/150',
    researchAreas: ['Molecular Biology', 'Genetics', 'Cancer Research'],
    bio: 'Pioneering researcher in cancer genetics with focus on personalized treatment approaches.',
    publications: 89,
    citations: 5234,
    currentOpportunities: 2,
    rating: 4.8,
    verified: true
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    title: 'Professor of Physics',
    institution: 'Harvard University',
    department: 'Physics',
    email: 'ewatson@harvard.edu',
    avatar: '/api/placeholder/150/150',
    researchAreas: ['Quantum Computing', 'Theoretical Physics', 'Nanotechnology'],
    bio: 'Leading expert in quantum computing with applications in cryptography and optimization.',
    publications: 156,
    citations: 12847,
    currentOpportunities: 4,
    rating: 4.9,
    verified: true
  },
  {
    id: '4',
    name: 'Dr. James Thompson',
    title: 'Professor of Chemistry',
    institution: 'Caltech',
    department: 'Chemistry & Chemical Engineering',
    email: 'jthompson@caltech.edu',
    avatar: '/api/placeholder/150/150',
    researchAreas: ['Organic Chemistry', 'Drug Discovery', 'Catalysis'],
    bio: 'Innovative researcher developing novel catalytic processes for sustainable drug synthesis.',
    publications: 98,
    citations: 6721,
    currentOpportunities: 2,
    rating: 4.7,
    verified: true
  },
  {
    id: '5',
    name: 'Dr. Lisa Park',
    title: 'Associate Professor of Psychology',
    institution: 'UC Berkeley',
    department: 'Psychology',
    email: 'lpark@berkeley.edu',
    avatar: '/api/placeholder/150/150',
    researchAreas: ['Cognitive Psychology', 'Neuroscience', 'Learning & Memory'],
    bio: 'Exploring the neural mechanisms of learning and memory formation in healthy and clinical populations.',
    publications: 76,
    citations: 4891,
    currentOpportunities: 3,
    rating: 4.8,
    verified: true
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@student.edu',
    university: 'MIT',
    major: 'Computer Science',
    year: 'Junior',
    gpa: 3.9,
    avatar: '/api/placeholder/150/150',
    skills: ['Python', 'Machine Learning', 'React', 'Data Analysis'],
    interests: ['AI Ethics', 'Computer Vision', 'Healthcare Tech'],
    bio: 'Passionate CS student with experience in ML applications for healthcare.',
    portfolio: {
      projects: ['Medical Image Classifier', 'AI Chatbot', 'Data Visualization Tool'],
      publications: ['IEEE Conference on AI in Healthcare'],
      awards: ['Dean\'s List', 'Hackathon Winner 2023']
    },
    applicationCount: 8,
    acceptanceRate: 0.75
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@student.edu',
    university: 'Stanford',
    major: 'Biology',
    year: 'Senior',
    gpa: 3.8,
    avatar: '/api/placeholder/150/150',
    skills: ['Molecular Biology', 'CRISPR', 'Data Analysis', 'Lab Techniques'],
    interests: ['Cancer Research', 'Genetics', 'Personalized Medicine'],
    bio: 'Biology major with hands-on research experience in cancer genetics.',
    portfolio: {
      projects: ['CRISPR Gene Editing Study', 'Cancer Cell Analysis'],
      publications: ['Nature Undergraduate Research'],
      awards: ['Outstanding Biology Student', 'Research Excellence Award']
    },
    applicationCount: 6,
    acceptanceRate: 0.83
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'AI-Powered Medical Diagnosis Research Assistant',
    professor: mockProfessors[0],
    description: 'Join our team developing cutting-edge AI systems for medical diagnosis. You\'ll work on computer vision algorithms for analyzing medical images and contribute to research that could save lives.',
    requirements: ['Strong Python programming skills', 'Machine learning experience', 'Computer vision knowledge preferred', 'Junior+ standing'],
    duration: '6 months',
    location: 'Cambridge, MA',
    type: 'Hybrid',
    compensation: '$20/hour',
    applicationDeadline: '2024-12-01',
    postedDate: '2024-10-15',
    applicants: 24,
    tags: ['AI', 'Healthcare', 'Computer Vision', 'Python'],
    status: 'Open'
  },
  {
    id: '2',
    title: 'Cancer Genetics Laboratory Research Position',
    professor: mockProfessors[1],
    description: 'Exciting opportunity to contribute to groundbreaking cancer research. Work with CRISPR technology and analyze genetic mutations in various cancer types.',
    requirements: ['Molecular biology coursework', 'Lab experience preferred', 'Strong analytical skills', 'Sophomore+ standing'],
    duration: '1 year',
    location: 'Palo Alto, CA',
    type: 'On-site',
    compensation: '$18/hour',
    applicationDeadline: '2024-11-20',
    postedDate: '2024-10-10',
    applicants: 18,
    tags: ['Biology', 'Cancer Research', 'CRISPR', 'Genetics'],
    status: 'Open'
  },
  {
    id: '3',
    title: 'Quantum Computing Algorithm Development',
    professor: mockProfessors[2],
    description: 'Work on the frontier of quantum computing, developing algorithms for optimization problems and quantum cryptography applications.',
    requirements: ['Advanced mathematics background', 'Programming experience (Python/C++)', 'Physics coursework', 'Senior standing preferred'],
    duration: '8 months',
    location: 'Cambridge, MA',
    type: 'On-site',
    compensation: '$25/hour',
    applicationDeadline: '2024-11-30',
    postedDate: '2024-10-20',
    applicants: 15,
    tags: ['Quantum Computing', 'Physics', 'Mathematics', 'Algorithms'],
    status: 'Open'
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    opportunityId: '1',
    studentId: '1',
    status: 'Pending',
    appliedDate: '2024-10-22',
    coverLetter: 'I am excited to apply for this research position...',
    documents: ['resume.pdf', 'transcript.pdf', 'portfolio.pdf']
  },
  {
    id: '2',
    opportunityId: '2',
    studentId: '2',
    status: 'Accepted',
    appliedDate: '2024-10-18',
    coverLetter: 'My background in molecular biology and passion for cancer research...',
    documents: ['resume.pdf', 'transcript.pdf', 'research_paper.pdf']
  }
];

// Mock user state
export const mockCurrentUser = {
  student: {
    name: 'Alex Johnson',
    role: 'student' as const,
    avatar: '/api/placeholder/150/150'
  },
  professor: {
    name: 'Dr. Sarah Chen',
    role: 'professor' as const,
    avatar: '/api/placeholder/150/150'
  }
};