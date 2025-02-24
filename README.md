# AI Manager - Your AI Engineering Manager

## 🎥 Demo Video

[Watch our 2-minute demo video](https://youtu.be/S3HERhU1Gfs?si=udMHmIz4utfLNU-b) showcasing AI Manager's Daily Standup feature in action!

## 🌟 Project Overview

### Title

AI Manager (www.aimgr.dev) - AI-Powered Engineering Management, Starting with Daily Standups

### Abstract

AI Manager brings the power of artificial intelligence to engineering management, starting with revolutionizing daily standups. For the hackathon, we've focused on creating an engaging, voice-enabled daily standup experience that makes remote standups more personal and efficient using advanced AI technology.

### Problem

Remote development teams face several challenges with daily standups:

- Lack of engagement in text-based updates
- Time zone coordination difficulties
- Missing the personal touch of in-person standups
- Inconsistent participation and follow-ups
- Difficulty maintaining a record of daily progress

### Solution

AI Manager's Daily Standup feature addresses these challenges by offering:

- Voice-enabled AI standup calls using ElevenLabs' conversational AI
- Natural conversation flow powered by OpenAI
- Automated scheduling and reminders via Inngest
- Persistent storage of standup records in Neon Database
- Asynchronous participation for distributed teams

## 👥 Team Information

### Team Members

- Daniel Wise ([@dubscode](https://github.com/dubscode)) - Lead Developer
  - Full-stack development
  - AI/ML integration
  - System architecture
  - Product design

## 🛠 Technical Details

### Tech Stack

- **Frontend**:

  - Next.js 15 (React 19)
  - TypeScript
  - Tailwind CSS
  - Radix UI Components

- **Backend**:

  - Next.js API Routes
  - Drizzle ORM
  - Neon PostgreSQL Database
  - Clerk Authentication
  - Inngest for job scheduling

- **AI/ML**:

  - OpenAI for natural language processing
  - ElevenLabs for voice synthesis
  - Linear API for task tracking integration

- **DevOps**:
  - Vercel Deployment
  - Environment Management
  - Analytics & Speed Insights
  - Progress tracking
  - Team member status updates

### Repository

[GitHub Repository](https://github.com/dubscode/ai-manager)

### Current Features

1. **AI-Powered Daily Standups**

   - Voice-enabled standup conversations
   - Natural language interaction
   - Automated scheduling
   - Progress tracking
   - Team member status updates
   - Linear issue querying during standups

2. **User Experience**
   - Clean, modern interface
   - Responsive design

### Architecture

The application follows a modern, scalable architecture:

- Next.js App Router for server-side rendering
- API routes for AI service integration
- PostgreSQL with Drizzle ORM for data persistence
- Background jobs with Inngest for scheduling
- Real-time voice processing with ElevenLabs

## 🚀 Future Roadmap

While our hackathon submission focuses on the Daily Standup feature, AI Manager has an ambitious vision for the future:

1. **Code Review Assistant**

   - Automated code review suggestions
   - Best practices enforcement
   - Security vulnerability detection

2. **Sprint Planning**

   - AI-powered story point estimation
   - Sprint capacity planning
   - Task prioritization

3. **Linear Integration Enhancement**

   - Automated issue creation and updates
   - Smart project tracking
   - Seamless workflow integration
   - Real-time synchronization with standups
   - AI-powered task management

4. **Technical Documentation**

   - Automated documentation generation
   - Knowledge base management
   - Code documentation assistance

5. **Team Analytics**

   - Developer productivity insights
   - Sprint performance metrics
   - Team health monitoring

## ✅ Compliance Statement

We hereby acknowledge and confirm that our submission:

- Adheres to all hackathon rules and guidelines
- Was completed within the designated hackathon timeframe
- Contains only original work or properly attributed open-source components
- Meets all submission deadlines and requirements

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/dubscode/ai-manager.git
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
# Fill in your environment variables:
# - OPENAI_API_KEY
# - ELEVEN_LABS_API_KEY
# - NEON_DATABASE_URL
# - CLERK_SECRET_KEY
# - INNGEST_EVENT_KEY
```

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## 📝 License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivs (CC BY-NC-ND) License.

This means:

- ✅ You can view and learn from the code
- ✅ You must give appropriate credit if discussing or showcasing the project
- ❌ You cannot use the code for commercial purposes
- ❌ You cannot distribute modified versions of the code
- ❌ You cannot use this code in your own projects

This repository is public primarily for hackathon submission requirements and portfolio demonstration purposes.
