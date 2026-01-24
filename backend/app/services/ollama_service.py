import httpx
from app.core.config import settings

class OllamaService:
    def __init__(self):
        self.base_url = settings.OLLAMA_HOST
        self.model = settings.OLLAMA_MODEL

    async def generate_response(self, prompt: str, focus_area: str = "General") -> str:
        async with httpx.AsyncClient(timeout=90.0) as client:
            try:
                # Constructing the system prompt for AI Tutor
                system_prompt = (
                    f"You are a professional Academic AI Tutor specializing in {focus_area}. "
                    "Your mission is to provide clear, structured, and insightful educational support. "
                    "Break down complex topics into digestible parts, use professional language, "
                    "and provide real-world examples where appropriate. "
                    f"Always maintain a supportive and scholarly tone appropriate for {focus_area} studies."
                )
                
                payload = {
                    "model": self.model,
                    "prompt": f"System: {system_prompt}\n\nStudent: {prompt}\n\nResponse:",
                    "stream": False
                }
                
                response = await client.post(f"{self.base_url}/api/generate", json=payload)
                response.raise_for_status()
                result = response.json()
                return result.get("response", "I'm sorry, I couldn't generate a response.")
                
            except httpx.RequestError as e:
                return f"Error connecting to Ollama: {str(e)}"
            except Exception as e:
                return f"An unexpected error occurred: {str(e)}"

ollama_service = OllamaService()
