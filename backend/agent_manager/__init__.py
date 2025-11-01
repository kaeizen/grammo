import os
from dotenv import load_dotenv
from dataclasses import dataclass
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent
import uuid

# Load environment variables from .env file
load_dotenv()

API_KEY = os.environ["HUGGINGFACEHUB_API_TOKEN"]
SYSTEM_PROMPT = os.environ["SYSTEM_PROMPT"]

MODEL = HuggingFaceEndpoint(
    repo_id="openai/gpt-oss-safeguard-20b",
    task="text-generation",
    max_new_tokens=512,
    do_sample=False,
    repetition_penalty=1.03,
    huggingfacehub_api_token=API_KEY
)

CHAT = ChatHuggingFace(llm=MODEL)

SESSION_AGENTS = {}

def get_or_create_agent(session):
    """Get the agent for this session or create a new one."""
    session_key = session.session_key

    if not session_key:
        session.create()
        session_key = session.session_key
        
        memory = InMemorySaver()
        agent = create_agent(
            model=CHAT,
            system_prompt=SYSTEM_PROMPT,
            checkpointer=memory
        )
        SESSION_AGENTS[session_key] = agent
    
    return SESSION_AGENTS.get(session_key)
        

def get_agent(session_id: str):
    """Return an existing agent for a session, or None if expired/closed."""
    return SESSION_AGENTS.get(session_id)

def end_session(session):
    """Delete an agent session to free memory."""
    session_key = session.session_key
    if session_key in SESSION_AGENTS:
        del SESSION_AGENTS[session_key]
        return True
    return False
