import { Club, Event, Notice, User } from './types';

export const CLUB_NAMES = ["Mulearn", "IEEE", "CSI", "ICFOSS", "IEDC", "YIP"];

export const MOCK_NOTICES: Notice[] = [
  { id: '1', title: 'Semester Exams Rescheduled', content: 'The S6 semester exams have been postponed by one week due to heavy rains.', date: '2023-10-24', category: 'exam' },
  { id: '2', title: 'Hackathon Registration Open', content: 'Register for the upcoming 24-hour hackathon organized by IEDC.', date: '2023-10-25', category: 'event' },
  { id: '3', title: 'Library Maintenance', content: 'The central library will remain closed this Sunday for renovation.', date: '2023-10-26', category: 'general' },
  { id: '4', title: 'Urgent: Scholarship Applications', content: 'Last date for E-Grantz submission is tomorrow.', date: '2023-10-27', category: 'urgent' },
];

export const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Tech Summit 2024', description: 'A gathering of the brightest minds in engineering.', date: 'Nov 15, 2024', location: 'Main Auditorium', organizer: 'IEEE', registeredCount: 120, imageUrl: 'https://picsum.photos/400/200' },
  { id: '2', title: 'Startup Pitch Deck', description: 'Pitch your ideas to top investors and alumni.', date: 'Nov 20, 2024', location: 'Seminar Hall', organizer: 'IEDC', registeredCount: 45, imageUrl: 'https://picsum.photos/400/201' },
  { id: '3', title: 'Python Workshop', description: 'Hands-on session on Python for Data Science.', date: 'Nov 22, 2024', location: 'Computer Lab 2', organizer: 'Mulearn', registeredCount: 80, imageUrl: 'https://picsum.photos/400/202' },
];

export const MOCK_CLUBS: Club[] = [
  { 
    id: 'c1', 
    name: 'Mulearn', 
    description: 'Learning by doing. A community for peer-to-peer learning and industry collaboration.', 
    logoInitial: 'M', 
    memberCount: 350,
    category: 'Tech & Coding',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'c2', 
    name: 'IEEE', 
    description: 'The world\'s largest technical professional organization dedicated to advancing technology.', 
    logoInitial: 'I', 
    memberCount: 200,
    category: 'Professional',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'c3', 
    name: 'IEDC', 
    description: 'Innovation and Entrepreneurship Development Centre. Fostering startup culture.', 
    logoInitial: 'E', 
    memberCount: 150,
    category: 'Innovation',
    image: 'https://images.unsplash.com/photo-1559136555-930d72f18615?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'c4', 
    name: 'CSI', 
    description: 'Computer Society of India student branch. Seminars, workshops and quizzes.', 
    logoInitial: 'C', 
    memberCount: 120,
    category: 'Tech Society',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'c5', 
    name: 'ICFOSS', 
    description: 'Promoting Free and Open Source Software. Workshops on Linux, Python and more.', 
    logoInitial: 'F', 
    memberCount: 90,
    category: 'Open Source',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800'
  },
];

export const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Dr. Smith (Admin)', role: 'admin' },
  { id: 'u2', name: 'Prof. Johnson (Faculty)', role: 'faculty' },
  { id: 'u3', name: 'Alex (Lead - IEEE)', role: 'lead', clubId: 'c2' },
  { id: 'u4', name: 'Sarah (Student)', role: 'student' },
];