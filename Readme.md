# FlowState — Execution OS & Productivity Platform

<div align="center">

![FlowState Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Electron%20Desktop-indigo?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Electron](https://img.shields.io/badge/Electron-40.6.1-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-v10.8.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.2.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A high-performance personal execution intelligence operating system blending gamified RPG mechanics, 4-tier cascading goal alignment, and Google Gemini AI productivity coaching.**

[Features](#-key-features) • [Architecture](#-architecture) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Getting Started](#-getting-started) • [Desktop Modes](#-desktop-native-modes) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

**FlowState** transforms traditional to-do lists into an immersive **Personal Execution Intelligence System (PEIS)**. By turning daily work into missions, tracking vital resources (HP, FP, EP), and cascading micro-actions directly into yearly milestones, FlowState solves the friction between high-level ambition and daily execution.

Available both as a modern web application and a native Windows desktop client with specialized ambient display modes.

---

## 🚀 Key Features

### 🎮 Gamified RPG Execution Engine
- **Player Progression & Character HUD**: Earn Experience Points (XP) dynamically scaled by quest difficulty. Level up to earn Attribute Points across Discipline, Knowledge, Creativity, Leadership, and Consistency.
- **Resource Management (HP / FP / EP)**:
  - **HP (Health Points)**: Lost on quest failure or deadlines; protected by defense perks.
  - **FP (Focus Points)**: Deep-work endurance capacity.
  - **EP (Energy Points)**: Daily stamina spent to undertake high-tier quests.
- **4 Archetype Personas**:
  - **Vanguard** *(Crimson)*: Physical vitality & morning focus; 2x XP on health missions.
  - **Strategist** *(Teal)*: Systems & planning; +25% knowledge growth & +20 FP capacity.
  - **Guardian** *(Gold)*: Habits & consistency; 20% less energy consumed, 30% damage reduction.
  - **Executor** *(Purple)*: High-volume output; +50% damage against Campaign Bosses.
- **Boss Quests**: Multi-stage challenging objectives (Elite & Legendary World Bosses) with high-stakes reward/penalty curves.

### 🎯 4-Tier Cascading Goal Pyramid
- **Hierarchical Alignment**: Yearly Goals $\rightarrow$ Quarterly Goals (4-Month Blocks) $\rightarrow$ Monthly Goals $\rightarrow$ Daily Tasks.
- **Automated Rollups**: Monthly goals calculate weighted progress from completed tasks; quarterly and yearly goals aggregate child goals proportionally based on impact weight.
- **Time Risk Intelligence**: Compares elapsed calendar time against progress percentage to flag goals as **On Track**, **At Risk**, or **Behind**.

### 📋 Precision Task Management & Calendar
- **Interactive Calendar Navigation**: Inspect past and future cycles with completion gauges.
- **Automatic Rollovers**: Incomplete tasks automatically roll over to today's cycle.
- **Debounced Snapshots**: Automatically records daily logs and completion percentages to Firestore.

### 📖 Codex Notes (Daily Reflection Journal)
- Dedicated, distraction-free journaling linked to each calendar date.
- Preserves daily reflections, retrospectives, and key learnings over time.

### 🤖 FlowState AI Productivity Coach
- **Gemini 2.0 Flash Powered**: Direct integration with Google Gemini Generative AI.
- **30-Day Context Injection**: Ingests your real completion stats, streak count, priority distribution, and upcoming schedule to deliver tailored, metrics-based guidance.
- **Local Fallback Mode**: Works completely offline or without an API key using smart statistical heuristics.

### 📊 Deep Analytics & Discipline Radar
- **Discipline Score (0–100)**: Multi-factor index evaluating Consistency (30%), Timeliness (30%), Priority Execution (20%), and Completion Rate (20%).
- **Interactive Visualizations**: Recharts-powered Weekly Completion Area charts, Monthly Trend lines, and 5-axis Discipline Radar diagrams.

---

## 🖥️ Desktop Native Modes (Electron)

FlowState includes a custom desktop integration designed for zero-distraction ambient execution:

- **Wallpaper Mode**: Pinned at the desktop background layer (`screen-saver` level) with 95% opacity and an interactive grid overlay, keeping priorities in constant peripheral focus.
- **Mini Mode**: A floating, pinned 380x600 widget docked to the corner of the display for quick task completion.
- **System Tray**: Runs in the Windows notification tray with minimize-to-tray, quick mode toggling, and auto-start on boot.
- **Hardware Optimization**: Flags configured to disable Chromium background timer throttling for smooth real-time tracking.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18 (`react-scripts 5.0.1`), React Router DOM v6 (`HashRouter`)
- **Desktop Runtime**: Electron 40.6.1, Electron Builder 26.8.1
- **Styling**: Tailwind CSS 3.2.4, PostCSS, Autoprefixer, Custom Cyberpunk RPG Theme
- **Data Visualization**: Recharts 2.4.3
- **Iconography**: Lucide React
- **State Management**: Zustand 4.1.4 (Character, Identity, Quests) + React Context API (Auth, Tasks, Goals, AI, Theme)
- **Backend**: Firebase Auth, Cloud Firestore, Firebase Storage
- **AI Integration**: Google Gemini 2.0 Flash API

---

## 📁 Project Structure

```
Daily_Tracker/
├── electron/               # Electron main process & preload context bridge
├── electron-app/           # Staging directory for desktop distribution
├── public/                 # Static assets & HTML entry
├── src/
│   ├── app/                # Application entry variants
│   ├── components/         # Modular UI components (ai, analytics, common, hud, tasks)
│   ├── config/             # App limits, defaults & API configurations
│   ├── context/            # Context providers (Auth, Task, Goal, AI, Theme)
│   ├── hooks/              # Custom hooks (useAuth, useTasks, useGoals, useAI, etc.)
│   ├── layouts/            # AuthLayout & MainLayout with responsive Sidebar
│   ├── pages/              # Dashboard, Tasks, Goals, Analysis, Analytics, AIChat, Settings
│   ├── services/           # Firebase (Auth, Firestore), aIService, analyticsService
│   ├── stores/             # Zustand stores (useCharacterStore, useIdentityStore, useQuestStore)
│   ├── styles/             # Global Tailwind directives & dark cyberpunk CSS
│   └── utils/              # Discipline engine, progress engine, priority helpers
├── build-electron.js       # Production Electron packaging script
├── electron-builder.yml    # NSIS installer configuration
└── package.json            # Dependencies and scripts
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **npm**: `v9.x` or higher
- **Firebase Project**: An active Firebase project with Authentication (Email, Google, GitHub) and Cloud Firestore.

### 1. Installation
```bash
git clone <repository_url>
cd Daily_Tracker
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Gemini API Key (can also be entered in Settings UI)
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Development
```bash
# Start Web client (http://localhost:3000)
npm start

# Run Web + Electron Desktop client concurrently
npm run electron:dev
```

### 4. Production Desktop Build
```bash
# Builds React production bundle and compiles NSIS Windows installer (.exe)
node build-electron.js
```
The output installer will be created in the `dist/` directory.

---

## 📖 Documentation

For an exhaustive, deep-dive architectural analysis of every service, store, formula, and database schema, please refer to:
👉 **[Project.md](Project.md)**

---

## 📄 License

Private & Proprietary © 2026 Ruturaj Bhome. All rights reserved.
