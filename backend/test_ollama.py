import httpx
import asyncio

async def test_ollama():
    import os
    ollama_host = os.environ.get('OLLAMA_HOST', 'http://localhost:11434')
    if not ollama_host.startswith('http'):
        ollama_host = f"http://{ollama_host}"
        
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f'{ollama_host}/api/generate',
                json={
                    'model': 'phi3',
                    'prompt': 'Say hello in one sentence',
                    'stream': False
                }
            )
            print("✅ Ollama is working!")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"❌ Ollama connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ollama())