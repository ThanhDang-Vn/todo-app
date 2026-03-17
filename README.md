# Todo App

A modern **Task Management** application that helps users efficiently track, categorize, and manage their daily tasks.

## 🚀 Tech Stack

This project is built on a modern web ecosystem:

- **Framework:** [Next.js 15](https://nextjs.org/) (with Turbopack for faster builds)
- **UI & Styling:** [Tailwind CSS 4](https://tailwindcss.com/) and components from [Radix UI](https://www.radix-ui.com/)
- **Authentication:** [Kinde Auth](https://kinde.com/)
- **Utilities:** `axios` (API calls), `date-fns` (date handling), `zod` (data validation), and `next-themes` (Dark/Light mode support)

## 🎯 Features & Milestones

- [ ] **Time-based Task Filtering:** Fetch all tasks from the database and categorize them by assigned date (handled on the backend).
- [ ] **Section-based Organization:** Use columns as distinct categories to organize and group tasks together.
- [ ] **Authentication & Authorization:** Add login, registration, and access control management for users.

## 💻 Getting Started

Make sure you have **Node.js** installed. To run the project in development mode, follow these steps:

### 1. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.