import httpx
from app.core.config import settings

class OllamaService:
    def __init__(self):
        self.base_url = settings.OLLAMA_HOST
        self.model = settings.OLLAMA_MODEL

    async def generate_response(self, prompt: str) -> str:
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                # Constructing the system prompt for AI Tutor
                system_prompt = (
                    "You are an expert AI tutor specialzing in Math and Science. "
                    "Your goal is to help students understand concepts by explaining them clearly. "
                    "Use examples and encourage critical thinking. "
                    "If a question is not about math or science, politely redirect them."
                )
                
                payload = {
                    "model": self.model,
                    "prompt": f"{system_prompt}\n\nStudent: {prompt}\n\nTutor:",
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
