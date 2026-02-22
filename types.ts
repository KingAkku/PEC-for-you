
export type Role = 'admin' | 'faculty' | 'lead' | 'student';

export interface User {
  id: string;
  name: string;
  role: Role;
  clubId?: string; // If lead or mentor
  department?: string;
  email?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'general' | 'exam' | 'event' | 'urgent';
  clubId?: string;
  authorId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  clubId?: string;
  imageUrl?: string;
  registeredCount: number;
  category: 'Technical' | 'Cultural' | 'Workshop' | 'Seminar' | 'Hackathon';
}

export interface Club {
  id: string;
  name: string;
  description: string;
  logoInitial: string; 
  memberCount: number;
  mentor?: string;
  image: string;
  category: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  clubId: string;
  role: string;
  joinedAt: string;
}

export interface HeroPopup {
  id: number;
  text: string;
  x: number;
  y: number;
  bgColor: string;
  textColor: string;
  borderRadius: number;
}
