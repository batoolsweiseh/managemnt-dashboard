# TaskFlow Dashboard

A modern, premium Task Management Dashboard built with Next.js App Router, Tailwind CSS, and NextAuth.js.

## 📋 Implementation Summary

This project was developed in four main phases to ensure a secure, analytical, and functional user experience.

---

### Phase 1: Authentication System (Task 1)
- **Objective**: Implement a secure authentication flow.
- **Tech**: NextAuth.js (v5 Beta) with Credentials Provider.
- **Features**:
  - Secure `/login` page with custom UI.
  - Session management using JWT.
  - **Protected Routes**: Middleware (`src/middleware.ts`) ensures that only authenticated users can access `/` and `/tasks`.
  - **Navigation**: Logged-in user information (Name/Email) is displayed in the responsive `Navbar`.
  - Logout functionality integrated across the app.

### Phase 2: Dashboard Page (Task 2)
- **Objective**: Provide a visual overview of task metrics and implementation progress.
- **Metrics Displayed**:
  - **Total Tasks**: Overall objective count.
  - **Completed Tasks**: Missions achieved.
  - **Pending Tasks**: Upcoming operational objectives.
  - **Overdue Tasks**: Critical items that missed their target date.
- **Visuals**:
  - Premium **Statistic Cards** with dynamic trends.
  - **Overall Progress Bar** calculating completion rate in real-time.
  - **Interactive Charts**: Status distribution visualized using `recharts` (Pie/Bar).
- **UX**:
  - Dedicated **Empty State**: "No tasks available. Create your first task to get started."
  - **Recent Activity Feed**: Quick glance at the latest mission updates.

### Phase 3: Advanced Task CRUD (Task 3)
- **Objective**: Build a robust management system for tasks with extended metadata.
- **Data Model**:
  - `Title`, `Description`, `Status` (Pending/In Progress/Completed), `Priority` (Low/Medium/High), `Due Date`, and `Assigned User`.
- **Operations**:
  - **Create**: Sophisticated, light-themed modal dialog with full form validation.
  - **Edit**: Instant modification of mission parameters.
  - **Delete**: Safe removal with confirmation protocols.
  - **Quick Updates**: Ability to update status directly from the task list.

### Phase 4: Search and Filtering (Task 4)
- **Objective**: Implement high-efficiency data discovery.
- **Features**:
  - **Instant Search**: Debounced title/description search in the "Mission Control" page.
  - **Advanced Filtering**: Filter by Status, Priority, and Due Date simultaneously.
  - **URL-Synced State**: Filters are reflected in the URL for shareability and consistent navigation.
  - **Dynamic UI**: Uses Next.js `useTransition` for smooth, non-blocking filtering updates.

---

## 🛠 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)

## 🏃‍♂️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up `.env.local`**:
   Add `AUTH_SECRET=your_secret` to.env.local.

3. **Run the development server**:
   ```bash
   npm run dev -p 3001
   ```

4. **Credentials for Review**:
   - **Email**: `batool@gmail.com`
   - **Password**: `password123`

AUTH_SECRET="f9e8a9f3b1b34c2c8f8d2273c5f4b4a6d1e37f6734c24df9872be9b3c4f7a2a1"
