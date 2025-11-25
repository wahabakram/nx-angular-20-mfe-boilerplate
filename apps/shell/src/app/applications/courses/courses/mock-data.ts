// Mock data for Courses module

export interface Category {
  id: string;
  name: string;
}

export interface CourseItem {
  id: number;
  name: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: 'Free' | 'Paid';
  type: 'Career path' | 'Skill path' | 'Certification path' | 'Course';
  hours: number;
  categoryId: string;
}

export const categoriesMock: Category[] = [
  { id: 'ai', name: 'AI' },
  { id: 'bash', name: 'Bash/Shell' },
  { id: 'c', name: 'C' },
  { id: 'csharp', name: 'C#' },
  { id: 'cpp', name: 'C++' },
  { id: 'cloud', name: 'Cloud computing' },
  { id: 'cs', name: 'Computer science' },
  { id: 'cyber', name: 'Cybersecurity' },
  { id: 'data-science', name: 'Data science' },
  { id: 'devops', name: 'DevOps' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'go', name: 'Go' },
  { id: 'html-css', name: 'HTML & CSS' },
  { id: 'interview', name: 'Interview prep' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'ml', name: 'Machine learning' },
  { id: 'mobile', name: 'Mobile development' },
  { id: 'open-source', name: 'Open source' },
  { id: 'php', name: 'PHP' },
  { id: 'python', name: 'Python' },
  { id: 'rust', name: 'Rust' },
  { id: 'sql', name: 'SQL' },
  { id: 'typescript', name: 'TypeScript' },
];

export const coursesMock: CourseItem[] = [
  { id: 1, name: 'Learn Python 3', description: 'Learn the basics of Python 3.12, one of the most versatile and in-demand languages today.', level: 'Beginner', price: 'Free', type: 'Course', hours: 23, categoryId: 'python' },
  { id: 2, name: 'Learn HTML', description: 'Start at the beginning with HTML basics — build and edit web pages.', level: 'Beginner', price: 'Free', type: 'Course', hours: 7, categoryId: 'html-css' },
  { id: 3, name: 'Learn JavaScript', description: 'Use JavaScript to add interactivity and power your websites.', level: 'Beginner', price: 'Free', type: 'Course', hours: 15, categoryId: 'javascript' },
  { id: 4, name: 'Learn Java', description: 'Code in Java — a robust language for mobile, web, and more.', level: 'Beginner', price: 'Free', type: 'Course', hours: 17, categoryId: 'java' },
  { id: 5, name: 'Learn SQL', description: 'Analyze data and manage large datasets with standard SQL.', level: 'Beginner', price: 'Free', type: 'Course', hours: 5, categoryId: 'sql' },
  { id: 6, name: 'Learn C++', description: 'A versatile language for games, databases, and more.', level: 'Beginner', price: 'Free', type: 'Course', hours: 11, categoryId: 'cpp' },

  // Additional random courses to cover filters
  { id: 7, name: 'Data Structures in Python', description: 'Master lists, dictionaries, sets, and algorithms in Python.', level: 'Intermediate', price: 'Paid', type: 'Course', hours: 18, categoryId: 'python' },
  { id: 8, name: 'Full-Stack Web Career Path', description: 'A comprehensive path to become a full-stack developer.', level: 'Beginner', price: 'Paid', type: 'Career path', hours: 120, categoryId: 'frontend' },
  { id: 9, name: 'Frontend Skill Path', description: 'Deep dive into modern frontend tools and frameworks.', level: 'Intermediate', price: 'Paid', type: 'Skill path', hours: 55, categoryId: 'frontend' },
  { id: 10, name: 'AWS Cloud Practitioner', description: 'Prepare for AWS Cloud Practitioner certification.', level: 'Beginner', price: 'Paid', type: 'Certification path', hours: 25, categoryId: 'cloud' },
  { id: 11, name: 'Algorithms I', description: 'Big-O, sorting, searching, and recursion fundamentals.', level: 'Intermediate', price: 'Free', type: 'Course', hours: 14, categoryId: 'cs' },
  { id: 12, name: 'Clean Code in JavaScript', description: 'Write readable and maintainable JS code.', level: 'Advanced', price: 'Paid', type: 'Course', hours: 9, categoryId: 'javascript' },
  { id: 13, name: 'React from Scratch', description: 'Build component-driven UIs with React.', level: 'Beginner', price: 'Free', type: 'Course', hours: 8, categoryId: 'frontend' },
  { id: 14, name: 'Angular Skill Path', description: 'Master Angular architecture, RxJS, and best practices.', level: 'Intermediate', price: 'Paid', type: 'Skill path', hours: 40, categoryId: 'typescript' },
  { id: 15, name: 'Kubernetes Administration', description: 'Deploy and manage containerized apps at scale.', level: 'Advanced', price: 'Paid', type: 'Certification path', hours: 75, categoryId: 'devops' },
  { id: 16, name: 'Intro to Git & GitHub', description: 'Version control workflows and collaboration.', level: 'Beginner', price: 'Free', type: 'Course', hours: 4, categoryId: 'open-source' },
  { id: 17, name: 'SQL Optimization', description: 'Indexes, query plans, and performance tuning.', level: 'Advanced', price: 'Paid', type: 'Course', hours: 12, categoryId: 'sql' },
  { id: 18, name: 'Machine Learning Career Path', description: 'From math basics to deploying ML models.', level: 'Intermediate', price: 'Paid', type: 'Career path', hours: 180, categoryId: 'ml' },
  { id: 19, name: 'Python Scripting Quickstart', description: 'Automate everyday tasks using Python.', level: 'Beginner', price: 'Free', type: 'Course', hours: 3, categoryId: 'python' },
  { id: 20, name: 'Docker for Developers', description: 'Containerize apps and manage images effectively.', level: 'Intermediate', price: 'Free', type: 'Course', hours: 6, categoryId: 'devops' },
  { id: 21, name: 'TypeScript Deep Dive', description: 'Advanced typing, generics, and patterns.', level: 'Advanced', price: 'Paid', type: 'Course', hours: 16, categoryId: 'typescript' },
  { id: 22, name: 'Data Analyst Skill Path', description: 'Excel, SQL, Python, and visualization tools.', level: 'Beginner', price: 'Paid', type: 'Skill path', hours: 60, categoryId: 'data-science' },
  { id: 23, name: 'Network Basics', description: 'Learn TCP/IP, routing, and troubleshooting.', level: 'Beginner', price: 'Free', type: 'Course', hours: 10, categoryId: 'cs' },
  { id: 24, name: 'Rust Fundamentals', description: 'Ownership, borrowing, and safe systems programming.', level: 'Intermediate', price: 'Paid', type: 'Course', hours: 20, categoryId: 'rust' },
  { id: 25, name: 'iOS Development with Swift', description: 'Build iOS apps using Swift and SwiftUI.', level: 'Intermediate', price: 'Paid', type: 'Course', hours: 35, categoryId: 'mobile' },
  { id: 26, name: 'Android Development Career Path', description: 'From Kotlin basics to publishing your first app.', level: 'Beginner', price: 'Paid', type: 'Career path', hours: 140, categoryId: 'mobile' },
  { id: 27, name: 'Cybersecurity Foundations', description: 'Threats, defense, and security best practices.', level: 'Beginner', price: 'Free', type: 'Course', hours: 9, categoryId: 'cyber' },
  { id: 28, name: 'DevOps Skill Path', description: 'CI/CD, monitoring, and infrastructure as code.', level: 'Intermediate', price: 'Paid', type: 'Skill path', hours: 58, categoryId: 'devops' },
  { id: 29, name: 'Project Management Certification', description: 'Get ready for the PMP exam with structured prep.', level: 'Advanced', price: 'Paid', type: 'Certification path', hours: 65, categoryId: 'cs' },
  { id: 30, name: 'GraphQL APIs', description: 'Design and build GraphQL APIs from scratch.', level: 'Intermediate', price: 'Free', type: 'Course', hours: 7, categoryId: 'frontend' },
  { id: 31, name: 'NoSQL Databases', description: 'MongoDB, Redis, and Cassandra concepts.', level: 'Intermediate', price: 'Free', type: 'Course', hours: 13, categoryId: 'data-science' },
  { id: 32, name: 'UI/UX Design Basics', description: 'Principles of user-centered design and prototyping.', level: 'Beginner', price: 'Free', type: 'Course', hours: 6, categoryId: 'frontend' },
  { id: 33, name: 'Advanced Algorithms II', description: 'Graphs, DP, and optimization techniques.', level: 'Advanced', price: 'Paid', type: 'Course', hours: 22, categoryId: 'cs' },
  { id: 34, name: 'Data Science Career Path', description: 'Statistics, ML, and data engineering essentials.', level: 'Intermediate', price: 'Paid', type: 'Career path', hours: 200, categoryId: 'data-science' },
  { id: 35, name: 'Linux Command Line', description: 'Navigate and automate in Linux environments.', level: 'Beginner', price: 'Free', type: 'Course', hours: 5, categoryId: 'bash' },
  { id: 36, name: 'Blockchain Fundamentals', description: 'Cryptography, consensus, and smart contracts.', level: 'Intermediate', price: 'Paid', type: 'Course', hours: 19, categoryId: 'open-source' },
  { id: 37, name: 'Google Analytics Certification', description: 'Prepare for Google Analytics certification.', level: 'Beginner', price: 'Paid', type: 'Certification path', hours: 15, categoryId: 'data-science' },
  { id: 38, name: 'Data Visualization with D3.js', description: 'Build interactive charts and dashboards.', level: 'Advanced', price: 'Free', type: 'Course', hours: 21, categoryId: 'frontend' },
  { id: 39, name: 'C# for Beginners', description: 'Start coding games and apps with C#.', level: 'Beginner', price: 'Free', type: 'Course', hours: 12, categoryId: 'csharp' },
  { id: 40, name: 'Go Microservices', description: 'Build scalable microservices in Go.', level: 'Advanced', price: 'Paid', type: 'Course', hours: 28, categoryId: 'go' },
];
