# Skill Up AI - README

## Overview

**Skill Up AI** is an AI-powered skill development platform designed to help users enhance their skills through personalized recommendations and learning paths. Built with Next.js and TypeScript, this platform leverages advanced AI technologies like Groq, Firebase for backend services, and MUI for a responsive and clean user interface.

## Features

- **User Authentication:** Secure and seamless user login, signup, and profile management using Clerk.
- **Skill Recommendations:** AI-driven suggestions for skill development, tailored to user profiles using Groq with Llama 3.
- **Learning Paths:** Structured learning paths with courses, tutorials, and exercises for skill development.
- **Progress Tracking:** Visual indicators of progress, with data stored in Firebase.
- **Responsive UI:** Clean and modern interface built with MUI, optimized for various devices.

## Project Structure

```plaintext
├── src
│   ├── app
│   ├── components
│   ├── firebase
│   ├── utils
│   └── pages
│       ├── api
│       ├── dashboard
│       ├── skill-recommendations
│       ├── learning-paths
│       └── progress-tracker
├── public
└── README.md
```

## Getting Started

# Prerequisites

Ensure you have the following installed:
* Node.js (v14.x or later)
* npm or yarn
* Firebase account
* Clerk account
* Groq Account

# Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/QoyyumO/ai-skills-dev.git
   cd ai-skills-dev
   ```

2. **Install Dependencies:**

   ```bash
   npm install # or yarn install
   ```

3. **Set Up Environment Variables:**
   Create a `.env.local` file at the root of the project and add your environment variables:

   ```plaintext
   GROQ_API_KEY=your-groq-api-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   NEXT_PUBLIC_CLERK_FRONTEND_API=your-clerk-frontend-api
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   FIREBASE_APP_ID=your-firebase-app-id
   ```

4. **Initialize Firebase:**
   Set up Firebase in the `src/firebase` directory. Ensure Firestore and Firebase Authentication are configured.

5. **Run the Development Server:**

   ```bash
   npm run dev # or yarn dev
   ```

   Open http://localhost:3000 to see the application in action.

## Development Guide

1. **Authentication with Clerk**
   * Install Clerk SDK and integrate it into the project.
   * Create pages for signup, login, and profile management.
   * Configure role-based access to features (e.g., free vs. premium users).

2. **Firebase Setup**
   * Set up Firestore collections for users, skills, learning paths, and progress tracking.
   * Implement Firestore rules to secure data.
   * (Optional) Implement Firebase Authentication if not using Clerk for all auth needs.

3. **AI Integration**
   * Use Groq with Llama 3 (8B, 8192) to create a skill recommendation system.
   * Create API routes to handle AI requests and return personalized recommendations.
   * Use AI to generate personalized content like quizzes and exercises.

4. **Frontend Development**
   * Use MUI components to build a responsive UI.
   * Develop key pages: Dashboard, Skill Recommendations, Learning Paths, and Progress Tracker.

5. **Backend Development**
   * Create secure API routes in Next.js to handle user interactions and data management.
   * (Optional) Implement Firebase Functions for backend logic requiring external execution.

## Deployment

1. **Build the Project:**

   ```bash
   npm run build # or yarn build
   ```

2. **Deploy to Vercel or Firebase Hosting:**
   Follow the respective platform's instructions for deploying a Next.js project.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
