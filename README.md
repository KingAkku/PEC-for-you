# PEC Portal - Technical Documentation

**Version:** 1.0.0  
**Stack:** React 19, TypeScript, Tailwind CSS, Framer Motion, Supabase  
**Design System:** Premium White Glassmorphism

---

## 1. Project Overview

**PEC Portal** is a centralized web platform for the **College of Engineering, Pathanapuram**. It serves as a digital hub for managing student communities (clubs), campus events, digital notices, and student profiles.

The application is built as a **Single Page Application (SPA)** using React, with **Supabase** acting as the Backend-as-a-Service (BaaS) for authentication and database management. The UI features a premium, modern aesthetic utilizing glassmorphism, neo-brutalism, and fluid animations.

---

## 2. Architecture & Technology Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Utility-first)
- **Animations:** Framer Motion (Page transitions, hover effects, micro-interactions)
- **Icons:** Lucide React
- **Routing:** Conditional rendering based on state (Custom simple router implemented in `App.tsx`)

### Backend (Supabase)
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth (Email/Password)
- **Real-time:** Supabase Realtime subscriptions (for Auth state)
- **Storage:** (Configured for future use, currently using URL strings for images)

---

## 3. Database Schema (PostgreSQL)

To rebuild this application, you must execute the following SQL in the Supabase SQL Editor.

### 3.1. Tables

#### A. `profiles` (Public User Data)
Extends the system `auth.users` table to store application-specific user details.

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT CHECK (role IN ('admin', 'faculty', 'lead', 'student')),
  department TEXT,
  club_id UUID REFERENCES public.clubs(id), -- Only for Club Leads
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

#### B. `clubs` (Student Communities)
Stores static information about clubs. Member counts are calculated dynamically from the `profiles` table.

```sql
CREATE TABLE public.clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_initial TEXT,
  category TEXT,
  image TEXT, -- URL to image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

#### C. `events` (Campus Activities)
Stores upcoming events.

```sql
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT, -- Stored as string for formatting flexibility (e.g., "Nov 15, 2024")
  location TEXT,
  organizer TEXT,
  image_url TEXT,
  category TEXT,
  registered_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

#### D. `notices` (Digital Notice Board)
Stores announcements.

```sql
CREATE TABLE public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  date TEXT,
  category TEXT CHECK (category IN ('general', 'exam', 'event', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### 3.2. Row Level Security (RLS) Policies (Recommended)

To secure the app, enable RLS:

1.  **Profiles:** Public read access. Update access only for the user themselves.
2.  **Clubs:** Public read access. Update access only for users with `role = 'lead'` where `profile.club_id` matches `clubs.id`.
3.  **Events/Notices:** Public read access. Insert/Update access only for `role IN ('admin', 'faculty', 'lead')`.

---

## 4. Design System & UI/UX

The design is "Template-less," meaning it uses custom CSS values extended via Tailwind.

### Color Palette
- **Background:** `slate-50` (#f8fafc) with a radial gradient mesh overlay.
- **Primary:** `slate-900` (Deep Black/Blue) for text and primary actions.
- **Glass Effect:** `bg-white/30`, `bg-white/80`, `backdrop-blur-xl`.
- **Accents:**
    - Red (Urgent/Notices)
    - Blue (Tech/Events)
    - Purple (Clubs/Creative)

### Typography
- **Headings:** `Fugaz One` (Google Fonts) - A geometric, cursive-inspired display font used for titles to give a retro-futuristic collegiate feel.
- **Body:** `Inter` (Google Fonts) - Clean, legible sans-serif for UI elements and reading text.

### Visual Effects
1.  **Glassmorphism:** Used on the Navbar, Modals, and Cards to create depth and separation from the mesh gradient background.
2.  **Micro-interactions:** Buttons scale (`scale-105`) on hover. Cards float upwards (`y: -5`).
3.  **Cursor Interaction:** The `Hero.tsx` component tracks mouse movement to spawn dynamic "Club Name" popups using `framer-motion`.

---

## 5. Directory Structure & Component Logic

### Root Files
- **`App.tsx`**: Main entry point. Handles routing (switch case on `currentView`), Auth state persistence, and initial data fetching.
- **`types.ts`**: TypeScript interfaces defining the shape of `User`, `Club`, `Event`, and `Notice` objects.
- **`constants.ts`**: Contains Mock Data (used as fallbacks) and static lists like `DEPARTMENTS`.
- **`utils.ts`**: Helper functions for generating random colors (used in Hero animation).

### `src/components`

1.  **`AuthModal.tsx`**:
    - Handles Login and Signup.
    - **Crucial Logic:** When signing up a 'Lead', it fetches the list of clubs from Supabase so the user can be immediately assigned to a club via Foreign Key.
    - Performs a "Dual Write": Creates user in `auth.users` AND inserts row in `public.profiles`.

2.  **`Navbar.tsx`**:
    - Responsive navigation.
    - Context-aware: Shows "My Club" only if `role === 'lead'`, "Dashboard" only if `role === 'admin'`.

3.  **`Hero.tsx`**:
    - The landing visual.
    - Logic: Listens to `onMouseMove`. If the mouse moves fast enough, it spawns a colorful popup with a random club name.

4.  **`NoticeBoard.tsx`**:
    - Displays notices in a grid.
    - Contains a "Post Notice" modal restricted to Admin/Faculty.

5.  **`ClubCard.tsx`**:
    - Reusable card component for displaying club info.
    - Supports "Manage" button if the viewer is an Admin/Lead.

### `src/pages`

1.  **`Home.tsx`**: Aggregates Hero, NoticeBoard, Quick Stats, and Feature links.
2.  **`Events.tsx`**:
    - Search & Filter: Client-side filtering by Category and Organizer.
    - Create Modal: Allows authorized users to push new events to Supabase.
3.  **`Clubs.tsx`**:
    - **Smart Logic:** It fetches all clubs, then fetches *all* profiles with a `club_id`. It calculates the `memberCount` in JavaScript by aggregating the profiles. This ensures the member count is always real and accurate.
4.  **`MyClub.tsx` (Lead Dashboard)**:
    - Only accessible to users with `role: lead`.
    - Fetches the specific club assigned to the user.
    - Allows editing Club Description/Image.
    - Lists real members fetched from `profiles` table.
5.  **`Dashboard.tsx` (Admin View)**:
    - Fetches all users from `profiles`.
    - Provides a tabular view to search and filter students by Department or Name.

---

## 6. Authentication Flow

1.  **User Trigger:** User clicks "Sign Up" in `AuthModal`.
2.  **Supabase Auth:** `supabase.auth.signUp()` is called with email/password.
3.  **Metadata:** Extra data (Name, Role, Dept) is passed in `options.data`.
4.  **Profile Creation:**
    - Immediately after successful Auth, the code manually runs `supabase.from('profiles').insert()`.
    - This ensures data consistency between the Auth system and the Public Profile system.
5.  **Session:** The `App.tsx` listens to `onAuthStateChange`. When a session is found, it fetches the user's full profile (including Role and Club ID) to hydrate the app state.

---

## 7. How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Steps

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file in the root (though `lib/supabase.ts` has fallbacks, using env vars is best practice):
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

3.  **Database Seed:**
    Run the SQL commands provided in Section 3 in your Supabase SQL Editor to create tables and insert initial data.

4.  **Start Application:**
    ```bash
    npm run dev
    ```

---

## 8. Deployment

The application is static (HTML/JS/CSS). It can be deployed to:
- **Vercel / Netlify:** Connect your GitHub repo. The build command is `npm run build`.
- **GitHub Pages:** Requires configuring base path in `vite.config.ts`.

---

## 9. Future Roadmap

1.  **Image Uploads:** Currently, images use URL strings. Future update should use Supabase Storage Buckets for file uploads.
2.  **Event Registration:** Add a `registrations` table to link `users` to `events` (Many-to-Many relationship).
3.  **Notice Attachments:** Allow PDF uploads for notices.
