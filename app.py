from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from gpt4all import GPT4All
import os
import chromadb
import traceback
import time

# Initialize Flask app
app = Flask(__name__)
# Configure CORS with extended timeouts
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Create static directory if it doesn't exist
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)

# Load GPT4All model
MODEL_NAME = "Nous-Hermes-2-Mistral-7B-DPO.Q4_0"
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models")

print("🔄 Loading GPT4All model...")
try:
    model = GPT4All(model_name=MODEL_NAME, model_path=MODEL_PATH, allow_download=True)
    print(f"✅ Model {MODEL_NAME} loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    print(traceback.format_exc())
    model = None

# Initialize ChromaDB for Retrieval-Augmented Generation (RAG)
try:
    chroma_client = chromadb.PersistentClient(path="chromadb_store")
    collection_name = "tutor-knowledge"
    if collection_name not in [c.name for c in chroma_client.list_collections()]:
        chroma_client.create_collection(name=collection_name)
    collection = chroma_client.get_collection(name=collection_name)
    print("✅ ChromaDB initialized successfully!")
except Exception as e:
    print(f"❌ Failed to initialize ChromaDB: {e}")
    print(traceback.format_exc())
    collection = None

def build_prompt(question, context=None):
    """
    Build the prompt to be passed to the GPT4All model.
    This prompt is specifically crafted to respond only to math and science questions.
    """
    prompt = (
        "You are an expert AI tutor who only answers questions related to math and science. "
        "If the question is outside these topics, respond with: "
        "'I'm here to help with math and science questions only.'\n"
    )
    if context:
        prompt += f"\nRelevant Context:\n{context}\n"
    prompt += f"\nQuestion: {question}\nAnswer:"
    return prompt

def get_context_from_rag(query):
    """
    Retrieve relevant context from the ChromaDB collection using the query.
    """
    if collection is None:
        print("[RAG WARNING] ChromaDB collection not available")
        return None
        
    try:
        results = collection.query(query_texts=[query], n_results=1)
        documents = results.get("documents", [[]])[0]
        return documents[0] if documents else None
    except Exception as e:
        print(f"[RAG ERROR] {e}")
        print(traceback.format_exc())
        return None

@app.route("/", methods=["GET", "OPTIONS"])
def home():
    return jsonify({"status": "AI Tutor Backend is running"}), 200

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon"
    )

@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    """
    Main endpoint to handle chat requests.
    Expects a JSON payload with a 'question' field.
    """
    try:
        # Log request information for debugging
        print(f"[REQUEST] Received chat request")
        
        # Verify model is loaded
        if model is None:
            return jsonify({"error": "AI model is not loaded. Please check server logs."}), 503
        
        # Parse request data
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON or Content-Type not set to application/json"}), 400
            
        question = data.get("question", "")
        if not question:
            return jsonify({"error": "Question is required."}), 400

        print(f"[CHAT] Processing question: {question[:50]}...")
        
        # Retrieve context from the database if available
        context = get_context_from_rag(question)
        prompt = build_prompt(question, context)

        # Generate response using the GPT4All model with timeout handling
        start_time = time.time()
        response_text = ""
        try:
            # Use non-streaming mode with a lower max_tokens to avoid timeouts
            response_text = model.generate(prompt, max_tokens=150)
            response_text = response_text.strip()
        except Exception as e:
            print(f"[MODEL ERROR] {e}")
            print(traceback.format_exc())
            return jsonify({"error": "Model inference failed. Please try again with a shorter question."}), 500
            
        print(f"[CHAT] Generated response in {time.time() - start_time:.2f} seconds")

        return jsonify({"response": response_text}), 200

    except Exception as e:
        print(f"[CHAT ERROR] {e}")
        print(traceback.format_exc())
        return jsonify({"error": f"An error occurred during processing: {str(e)}"}), 500

if __name__ == "__main__":
    print("🚀 Starting AI Tutor Flask backend on http://0.0.0.0:8000")
    # Set threaded=True and increase timeout
    app.run(debug=True, host="0.0.0.0", port=8000, threaded=True)
