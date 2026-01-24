import asyncio
import sys
sys.path.insert(0, 'c:/Users/ASUS/Desktop/AI-TUTOR-/backend')

from app.services.ollama_service import ollama_service

async def test():
    print("Testing Ollama connection from backend service...")
    response = await ollama_service.generate_response("What is 2+2?", "Mathematics")
    print(f"\nResponse: {response}")

if __name__ == "__main__":
    asyncio.run(test())
