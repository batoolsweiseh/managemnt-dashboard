# TaskFlow Dashboard

A modern, premium Task Management Dashboard built with Next.js App Router, Tailwind CSS, and NextAuth.js. This application allows users to manage their operational objectives with advanced CRUD capabilities, real-time analytics, and sophisticated filtering.

## 🚀 Features

### Task 1: Authentication System
- Secure login flow using `NextAuth.js` credentials provider.
- Protected routes utilizing Next.js Server Components and Middleware.
- Navigation bar displaying logged-in user information.

### Task 2: Dashboard Page
- **Real-time Analytics**: Displays total, completed, pending, and overdue tasks.
- **Premium UI**: Dark-themed, glassmorphism design with responsive cards and engaging micro-animations.
- **Data Visualization**: Integrates `recharts` for dynamic pie and bar charts reflecting task status distribution.
- **Recent Activity Feed**: Shows the latest task updates with dynamic status indicators.

### Task 3: Advanced Task CRUD
- Extended task data model with Title, Description, Status, Priority, Due Date, and Assigned User.
- Create, Update, and Delete task operations using Next.js Server Actions.
- Form validation integrated within an animated modal dialog.
- Status values: `Pending`, `In Progress`, `Completed`.
- Priority values: `Low`, `Medium`, `High`.

### Task 4: Search and Filtering
- **Dynamic Search**: Instantly find tasks by their title or description.
- **Multi-faceted Filtering**: Filter tasks by Status, Priority, and Due Date simultaneously.
- **Real-time Updates**: Filters update the task list seamlessly without full page reloads using Next.js `useTransition` and the URL search parameters approach.
- See implementation details in `src/components/TaskFilters.tsx` and `src/app/tasks/page.tsx`.

## 🛠 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)

## 🏃‍♂️ Getting Started

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd batool.dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up `.env.local`**:
   Create a `.env.local` file in the root directory and add the `AUTH_SECRET`:
   ```env
   AUTH_SECRET=your_super_secret_string_here
   ```
   *(You can generate one using `openssl rand -base64 32`)*

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Login**:
   - Navigate to `http://localhost:3000`
   - Use any email (e.g., `admin@example.com`) and any password longer than 6 characters to log in.

## 🔎 Implementation Note: Search and Filtering
The search and filtering mechanisms are built using Next.js 15+'s `useSearchParams`, `usePathname`, and `useRouter` hooks.
- As the user interacts with inputs (e.g., typing in the search bar or changing a select dropdown), the URL parameters are updated instantly.
- A slight debounce is used for the text input to prevent excessive renders.
- `useTransition` enables smooth, non-blocking UI updates while the server re-fetches and filters the data.
- The `getTasks` function in `src/lib/data.ts` acts as the mock backend endpoint, querying the data based on provided parameters.
 
 AUTH_SECRET="f9e8a9f3b1b34c2c8f8d2273c5f4b4a6d1e37f6734c24df9872be9b3c4f7a2a1"
