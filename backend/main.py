from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are a knowledgeable and friendly financial assistant. 
You help users understand stocks, investing strategies, personal finance, 
and general market concepts. Always explain things clearly and simply.

Important: You are not a licensed financial advisor. Always remind users 
that your responses are for educational purposes only and not personalised 
financial advice. Encourage them to consult a professional for major decisions."""


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]


@app.get("/")
def root():
    return {"status": "AI Investment Chatbot API is running"}


@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    conversation = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    for msg in request.messages:
        conversation.append({"role": msg.role, "content": msg.content})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=conversation,
            max_tokens=500,
            temperature=0.7,
        )
        reply = response.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")