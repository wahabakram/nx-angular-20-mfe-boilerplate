// Mock data for Course Details page

export interface CourseDetails {
  title: string;
  subtitle: string;
  rating: number;
  ratingsCount: number;
  learners: number;
  price: number;
  oldPrice: number;
  hours: number;
  lectures: number;
  level: string;
  language: string;
}

export const courseDetailsMock: CourseDetails = {
  title: 'Full-Stack Web Development with React 19 and Node.js 22',
  subtitle: 'Build modern, production-ready apps with React, TypeScript, Node.js, Express, PostgreSQL, Prisma, and Docker',
  rating: 4.8,
  ratingsCount: 128431,
  learners: 564210,
  price: 19.99,
  oldPrice: 129.99,
  hours: 32,
  lectures: 145,
  level: 'All levels',
  language: 'English',
};

export const courseBenefitsMock: readonly string[] = [
  'Master React 19 fundamentals and advanced patterns with TypeScript 5',
  'Build a complete backend with Node.js 22, Express, and PostgreSQL',
  'Type-safe data layer using Prisma ORM and Zod validation',
  'State management with Redux Toolkit, RTK Query, and Zustand',
  'Routing, data loading, and code-splitting for production React apps',
  'Authentication and authorization with JWT, sessions, and OAuth',
  'Real-time features with WebSockets and Server-Sent Events',
  'Testing React and Node with Vitest, Testing Library, and Supertest',
  'CI/CD pipelines, Dockerization, and environment configuration',
  'Accessibility (a11y), performance, and SEO best practices',
  'Deploy to Vercel (frontend) and Render/Fly.io (backend) with databases',
  'Hands-on capstone project: Ship a production-ready SaaS app',
];

// Related topics chips for the course page
export const relatedTopicsMock: readonly string[] = [
  'React',
  'Web Development',
  'TypeScript',
];

// "This course includes" feature list
export interface CourseIncludeItem {
  icon: string;   // material icon name
  text: string;
}

export const courseIncludesMock: readonly CourseIncludeItem[] = [
  { icon: 'smart_display', text: '32 hours on-demand video' },
  { icon: 'assignment_turned_in', text: '2 practice projects' },
  { icon: 'article', text: '18 articles' },
  { icon: 'download', text: '12 downloadable resources' },
  { icon: 'phone_iphone', text: 'Access on mobile and TV' },
  { icon: 'closed_caption', text: 'Closed captions' },
  { icon: 'hearing', text: 'Audio description in existing audio' },
  { icon: 'workspace_premium', text: 'Certificate of completion' },
];

// Course content accordion mock data
export interface CourseLesson {
  title: string;
  duration: string; // e.g., "03:50"
  preview?: boolean;
}

export interface CourseSection {
  title: string;
  lectures: number;
  duration: string; // e.g., "15min"
  lessons: readonly CourseLesson[];
}

export const courseContentMock: readonly CourseSection[] = [
  {
    title: 'Introduction & Course Overview',
    lectures: 6,
    duration: '16min',
    lessons: [
      { title: 'Welcome to Full-Stack React & Node', duration: '03:40', preview: true },
      { title: 'How to Get the Most out of This Course', duration: '02:10' },
      { title: 'What We Are Building (SaaS App Preview)', duration: '03:20', preview: true },
      { title: 'Tooling Overview', duration: '02:55' },
      { title: 'Course Resources & Repo Setup', duration: '02:05' },
      { title: 'About Your Instructor', duration: '01:50' },
    ],
  },
  { title: 'Project Setup & Tooling', lectures: 3, duration: '12min', lessons: [ { title: 'Node, PNPM/NPM, and VS Code Setup', duration: '04:00' }, { title: 'ESLint, Prettier, and EditorConfig', duration: '04:10' }, { title: 'Vite + React + TS Project Bootstrap', duration: '03:50' } ] },

  {
    title: 'Modern JavaScript & TypeScript Essentials',
    lectures: 5,
    duration: '24min',
    lessons: [
      { title: 'TS Basics for React Devs', duration: '04:10', preview: true },
      { title: 'Generics, Utility Types, and Narrowing', duration: '05:05' },
      { title: 'Async/Await Patterns and Fetch', duration: '04:40' },
      { title: 'Zod Schemas and Validation', duration: '05:10' },
      { title: 'Organizing Types in a Monorepo', duration: '04:55' },
    ],
  },
  {
    title: 'React Fundamentals',
    lectures: 6,
    duration: '40min',
    lessons: [
      { title: 'Components, Props, and Composition', duration: '06:20' },
      { title: 'State and Events', duration: '05:35' },
      { title: 'Hooks: useState, useEffect, useMemo', duration: '06:15' },
      { title: 'Forms and Controlled Components', duration: '07:45', preview: true },
      { title: 'Context API and Custom Hooks', duration: '07:55' },
      { title: 'Data Fetching Patterns', duration: '06:10' },
    ],
  },
  {
    title: 'Advanced React & Performance',
    lectures: 5,
    duration: '34min',
    lessons: [
      { title: 'Code Splitting and Suspense', duration: '06:50' },
      { title: 'Memoization Strategies', duration: '06:35' },
      { title: 'Accessibility (a11y) Basics', duration: '06:20' },
      { title: 'Error Boundaries and Sentry', duration: '07:15' },
      { title: 'Animations with Framer Motion', duration: '07:00' },
    ],
  },
  {
    title: 'State Management',
    lectures: 5,
    duration: '33min',
    lessons: [
      { title: 'Redux Toolkit Overview', duration: '07:00' },
      { title: 'RTK Query for Data Fetching', duration: '07:30' },
      { title: 'Zustand for Local State', duration: '06:10' },
      { title: 'Persisting State and Offline Strategies', duration: '06:40' },
      { title: 'Comparing Approaches & Best Practices', duration: '05:40' },
    ],
  },
  {
    title: 'Routing & App Structure',
    lectures: 4,
    duration: '28min',
    lessons: [
      { title: 'React Router Setup and Data Loaders', duration: '07:20' },
      { title: 'Nested Routes and Layouts', duration: '06:40' },
      { title: 'Protected Routes and Auth Guards', duration: '07:10' },
      { title: 'Code Organization at Scale', duration: '07:10' },
    ],
  },
  {
    title: 'Backend with Node.js, Express & Prisma',
    lectures: 6,
    duration: '45min',
    lessons: [
      { title: 'Project Structure and Environment', duration: '07:15' },
      { title: 'REST API with Express', duration: '08:05' },
      { title: 'PostgreSQL with Prisma', duration: '07:35', preview: true },
      { title: 'Zod Validation and Error Handling', duration: '08:30' },
      { title: 'Authentication with JWT & Cookies', duration: '07:10' },
      { title: 'File Uploads and Static Assets', duration: '06:55' },
    ],
  },
  {
    title: 'Real-time & Advanced Backend',
    lectures: 4,
    duration: '29min',
    lessons: [
      { title: 'WebSockets with Socket.IO', duration: '07:25' },
      { title: 'Server-Sent Events and Streams', duration: '06:35' },
      { title: 'Background Jobs and Queues', duration: '07:15' },
      { title: 'Caching with Redis', duration: '07:45' },
    ],
  },
  {
    title: 'Testing Frontend and Backend',
    lectures: 4,
    duration: '27min',
    lessons: [
      { title: 'Vitest and React Testing Library', duration: '06:40' },
      { title: 'Unit and Integration Tests (Node)', duration: '06:50' },
      { title: 'Supertest for API Endpoints', duration: '06:55' },
      { title: 'E2E Strategies and Best Practices', duration: '06:35' },
    ],
  },
  {
    title: 'DevOps: Docker, CI/CD & Deployment',
    lectures: 4,
    duration: '26min',
    lessons: [
      { title: 'Dockerizing Frontend and Backend', duration: '06:35' },
      { title: 'CI/CD with GitHub Actions', duration: '06:20' },
      { title: 'Secrets and Config Management', duration: '06:45', preview: true },
      { title: 'Deploying to Vercel and Render', duration: '06:20' },
    ],
  },
  {
    title: 'Capstone Project: Ship Your SaaS',
    lectures: 3,
    duration: '20min',
    lessons: [
      { title: 'Project Brief and Requirements', duration: '06:30' },
      { title: 'Implementation Walkthrough', duration: '06:25' },
      { title: 'Launch Checklist and Next Steps', duration: '07:05' },
    ],
  },
];

export const courseRequirementsMock: readonly string[] = [
  'Basic HTML, CSS, and JavaScript knowledge',
  'Node.js LTS installed on your machine',
  'A code editor like VS Code and a GitHub account',
];

export const courseDescriptionMock = `Welcome! Build and ship a real, production-ready full‑stack application with React 19, TypeScript 5, Node.js 22, Express, PostgreSQL, Prisma, and Docker. This hands‑on course takes you from fundamentals to deployment with modern tooling, testing, and best practices.`;

// Reviews mock data
export interface CourseReview {
  name: string;
  avatarKey: string; // used by -dicebear to generate an avatar
  rating: number; // 0..5 with halves, e.g., 4.5
  timeAgo: string; // e.g., "a week ago"
  text: string;
}

export const courseReviewsMock: readonly CourseReview[] = [
  {
    name: 'Maya R.',
    avatarKey: 'MR',
    rating: 5,
    timeAgo: '2 weeks ago',
    text: 'Exactly what I needed to ship my first SaaS MVP. The React + Prisma sections are gold and the deployment steps were super clear.',
  },
  {
    name: 'Daniel S.',
    avatarKey: 'DS',
    rating: 4.5,
    timeAgo: 'a month ago',
    text: 'Great pacing and real-world patterns. I finally understand RTK Query and how to structure large React apps.',
  },
  {
    name: 'Fatima A.',
    avatarKey: 'FA',
    rating: 4.5,
    timeAgo: 'a month ago',
    text: 'Comprehensive and practical. Loved the testing and CI/CD modules — helped me clean up my pipeline at work.',
  },
  {
    name: 'Leo C.',
    avatarKey: 'LC',
    rating: 4.5,
    timeAgo: '2 months ago',
    text: 'Clear explanations, modern stack, and a useful capstone project. Highly recommend for aspiring full‑stack devs.',
  },
];
