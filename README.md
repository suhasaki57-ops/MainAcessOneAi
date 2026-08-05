# ascess-1-ai 🚀
> **Enterprise AI-Powered Inclusive Accessibility & Web Audit Platform**

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini_AI-1.5_Pro-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 📌 Problem Statement

Over 1.3 billion people worldwide live with disabilities—including visual impairment, dyslexia, cognitive difficulty, and motor limitations. Most modern web applications fail to meet basic WCAG 2.1 AA standards, rendering digital content inaccessible. Furthermore, content simplification, multi-language screen reading, and real-time accessibility auditing are fragmented across disconnected tools.

---

## 🌟 Solution Overview

**ascess-1-ai** is a unified, production-grade AI accessibility platform powered by **Google Gemini AI** and **Supabase PostgreSQL**. It acts as a 24/7 accessibility assistant:
- **Instant Document & Web Processing**: Ingests PDFs, images (Tesseract OCR), raw text, and live web URLs.
- **Gemini AI Copilot**: Context-aware AI assistant providing text simplification, multi-language translation (14 languages), and document Q&A.
- **Smart WCAG 0-100 Scoring Engine**: Automated auditing with 5-level priority issue categorization (Critical, High, Medium, Low, Info) and AI code rewrites.
- **Inclusive Voice Accessibility**: Built-in Text-to-Speech (TTS), Speech-to-Text (STT) mic listener, and Voice Command parser ("Go to Dashboard", "Enable Dyslexia Mode").
- **Dyslexia & High Contrast Modes**: On-demand OpenDyslexic typography, reading rulers, and high contrast WCAG AAA themes.

---

## 🏗️ Architecture & Technical Workflow

```mermaid
graph TD
    A[Client UI - React 19 + Tailwind CSS] -->|JWT Auth + Axios| B[Express.js REST API]
    B -->|Zod Validation + Security Middleware| C[AI Engine Orchestrator]
    C -->|Memory LRU Cache + Retry Handler| D[Google Gemini 1.5 Pro API]
    B -->|Document Ingestion Engine| E[pdf-parse / Cheerio / Tesseract OCR]
    B -->|Data Persistence| F[(Supabase PostgreSQL)]
    A -->|Web Speech API| G[Text-To-Speech & Voice Commands]
```

---

## 🔥 Key Features

1. **Google Gemini AI Engine**: 9 REST API endpoints for simplification, translation, audit, alt-text generation, OCR cleaning, summarization, website evaluation, and reading assistance.
2. **Smart Document Hub**: Drag-and-drop PDF parsing, OCR image text extraction, and web scraping.
3. **Voice Accessibility System**: Hands-free voice commands, screen reader controls, speed/pitch adjustments, and microphone STT input.
4. **Dyslexia & High Contrast Suite**: Reading ruler overlay, dyslexia letter-spacing, font size scaling, and WCAG AAA themes.
5. **Multi-Format Report Exporter**: Download audit reports as PDF, JSON, Markdown (.md), or Plain Text (.txt).
6. **Visual Analytics Dashboard**: Track weekly score progression, document type breakdowns, and Gemini AI usage metrics.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Material UI, Framer Motion, React Icons, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, Supabase Client, JWT, bcryptjs, Helmet, Morgan, CORS, `@google/generative-ai`.
- **Parsing Libraries**: `pdf-parse` (PDF extraction), `cheerio` (Web scraping), `tesseract.js` (Image OCR).

---

## 📂 Project Structure

```
ascess-1-ai/
├── backend/
│   ├── src/
│   │   ├── ai/                      # Gemini AI client, promptBuilder, cache, retryHandler
│   │   ├── config/                  # Environment variables & CORS settings
│   │   ├── controllers/             # Auth, User, AI, Document, Accessibility controllers
│   │   ├── middleware/              # JWT, Validation, Upload, Error handlers
│   │   ├── routes/                  # REST route definitions
│   │   ├── services/                # Document processing & Accessibility audit services
│   │   ├── supabase/                # Database client & helper utilities
│   │   ├── validations/             # Zod validation schemas
│   │   ├── app.js                   # Express application setup
│   │   └── server.js                # Server entry point
│   ├── .env.example
│   └── render.yaml                  # Render deployment config
│
└── frontend/
    ├── src/
    │   ├── components/              # Accessibility toolbar, UI primitives, Layouts
    │   ├── context/                 # Auth, Theme, Speech, Settings, Notification contexts
    │   ├── hooks/                   # useSpeechSynthesis, useSpeechRecognition, useVoiceCommands
    │   ├── pages/                   # 9 main feature pages + auth routes
    │   ├── routes/                  # Protected & Guest routing rules
    │   ├── services/                # Axios API services
    │   ├── App.jsx                  # Root component
    │   └── index.css                # Custom CSS design system & accessibility tokens
    ├── .env.example
    └── vercel.json                  # Vercel deployment spec
```

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your GEMINI_API_KEY and SUPABASE credentials in .env
npm run dev
```
*Backend runs at http://localhost:5000*

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend runs at http://localhost:5173*

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
