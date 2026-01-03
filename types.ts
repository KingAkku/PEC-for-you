export type Role = 'admin' | 'faculty' | 'lead' | 'student';

export interface User {
  id: string;
  name: string;
  role: Role;
  clubId?: string; // If lead or mentor
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'general' | 'exam' | 'event' | 'urgent';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  imageUrl?: string;
  registeredCount: number;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  logoInitial: string; // e.g., 'M' for Mulearn
  membersCount: number;
  mentor?: string;
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
