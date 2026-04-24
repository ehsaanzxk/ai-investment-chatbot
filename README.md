# AI Investment Chatbot

A full-stack AI-powered financial assistant built with Next.js, FastAPI, and GPT-4o mini.

## Live Demo
https://ai-investment-chatbot-myddgvxbv-ehsaanzxks-projects.vercel.app

## Features
- Conversational AI with full message history and context-aware responses
- Financial assistant persona with investment and market knowledge
- Real-time responses powered by GPT-4o mini
- Clean, responsive chat interface
- Loading state with animated indicator
- Built-in financial disclaimer on all responses

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.12 |
| AI Model | OpenAI GPT-4o mini |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## Project Structure
- frontend/ - Next.js app with chat UI
- backend/ - FastAPI server and OpenAI integration

## Local Setup

### Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
Create a .env file with: OPENAI_API_KEY=your_key_here
uvicorn main:app --reload

### Frontend
cd frontend
npm install
Create a .env.local file with: NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev

Open http://localhost:3000 in your browser.

## Disclaimer
This application is for educational purposes only and does not constitute financial advice. Always consult a licensed financial advisor before making investment decisions.
