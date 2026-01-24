import httpx
from app.core.config import settings

class OllamaService:
    def __init__(self):
        self.base_url = settings.OLLAMA_HOST
        self.model = settings.OLLAMA_MODEL
        print(f"🤖 Ollama Service Initialized:")
        print(f"   Base URL: {self.base_url}")
        print(f"   Model: {self.model}")

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
                
            except httpx.ConnectError as e:
                error_msg = f"Connection failed to Ollama at {self.base_url}"
                print(f"❌ OLLAMA CONNECTION ERROR: {error_msg}")
                print(f"   Error details: {str(e)}")
                print(f"   Error type: {type(e).__name__}")
                print(f"   Make sure Ollama is running: ollama serve")
                print(f"   Current OLLAMA_HOST: {self.base_url}")
                return f"Error connecting to Ollama: Connection failed. Please ensure Ollama is running."
            except httpx.TimeoutException as e:
                error_msg = f"Timeout connecting to Ollama at {self.base_url}"
                print(f"❌ OLLAMA TIMEOUT: {error_msg}")
                print(f"   The request took too long. Ollama might be overloaded.")
                return f"Error: Ollama request timed out. Please try again."
            except httpx.RequestError as e:
                error_msg = f"Request error to Ollama at {self.base_url}: {str(e)}"
                print(f"❌ OLLAMA REQUEST ERROR: {error_msg}")
                print(f"   Error type: {type(e).__name__}")
                print(f"   Make sure Ollama is running with: ollama serve")
                print(f"   Current OLLAMA_HOST: {self.base_url}")
                return f"Error connecting to Ollama: {str(e)}. Please ensure Ollama is running."
            except httpx.HTTPStatusError as e:
                error_msg = f"HTTP error from Ollama: {e.response.status_code}"
                print(f"❌ OLLAMA HTTP ERROR: {error_msg}")
                print(f"   Response: {e.response.text}")
                return f"Error: Ollama returned status {e.response.status_code}"
            except Exception as e:
                error_msg = f"An unexpected error occurred: {str(e)}"
                print(f"❌ UNEXPECTED ERROR: {error_msg}")
                print(f"   Error type: {type(e).__name__}")
                import traceback
                print(f"   Traceback: {traceback.format_exc()}")
                return f"An unexpected error occurred: {str(e)}"

ollama_service = OllamaService()
