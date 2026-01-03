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
  { id: 'c1', name: 'Mulearn', description: 'Learning by doing. A community for peer-to-peer learning.', logoInitial: 'M', membersCount: 350 },
  { id: 'c2', name: 'IEEE', description: 'Advancing technology for humanity.', logoInitial: 'I', membersCount: 200 },
  { id: 'c3', name: 'IEDC', description: 'Innovation and Entrepreneurship Development Centre.', logoInitial: 'E', membersCount: 150 },
  { id: 'c4', name: 'CSI', description: 'Computer Society of India student branch.', logoInitial: 'C', membersCount: 120 },
  { id: 'c5', name: 'ICFOSS', description: 'Free and Open Source Software club.', logoInitial: 'F', membersCount: 90 },
];

export const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Dr. Smith (Admin)', role: 'admin' },
  { id: 'u2', name: 'Prof. Johnson (Faculty)', role: 'faculty' },
  { id: 'u3', name: 'Alex (Lead - IEEE)', role: 'lead', clubId: 'c2' },
  { id: 'u4', name: 'Sarah (Student)', role: 'student' },
];
