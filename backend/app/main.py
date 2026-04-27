from dotenv import load_dotenv
from flask import Flask, jsonify, request, Response
import json
from flask_cors import CORS
import anthropic
from pathlib import Path
import os
from .defaults.reactPrompt import basePrompt as reactBasePrompt
from .defaults.nodePrompt import basePrompt as nodeBasePrompt
from .defaults.prompt import BASE_PROMPT, generate_system_prompt

# Always load env vars from backend/app/.env regardless of run directory.
load_dotenv(Path(__file__).with_name(".env"))
app = Flask(__name__)
app.config.from_pyfile('settings.py')
CORS(app)

client = anthropic.Anthropic(
    api_key = app.config.get('ANTHROPIC_API_KEY')
)

@app.get("/")
def home():
    return 'Welcome to Bolt'

@app.post("/template")
def template_post():
    try:
        prompt = request.get_json()
        data = prompt['prompt']
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[ 
                {"role": "user", "content": data}
            ],
            system= "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        )
        answer = (response.content)[0].text
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    if answer == 'react':
        response_data = jsonify({
            "prompts": [BASE_PROMPT, f'Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n{reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n'],
            "uiprompt": [reactBasePrompt]
        })
        return response_data, 200
    
    if answer == 'node':
        return jsonify({
            "prompts": [nodeBasePrompt]
        }), 200
    
    return jsonify({"error": "Unrecognized prompt"}), 400


@app.post("/chat")
def continue_chat():
 try:
    req_data = request.get_json()
    data = req_data["messages"]
    if data:
        return Response(generate_stream(data), mimetype="text/event-stream")
 except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_stream(message):
    print('Inside function')
    with client.messages.stream(
    model="claude-3-7-sonnet-20250219",
    max_tokens = 8000,
    messages = message,
    system = generate_system_prompt()
    ) as stream:
      for text in stream.text_stream:
        print(text, end="", flush=True)
        # Send newline-delimited JSON so the frontend can parse stream chunks safely.
        yield json.dumps({"text": text}) + "\n"
        
        
        
        
        
        
        
        
# def continue_chat():
#  try:
#     req_data = request.get_json()
#     data = req_data["messages"]
#     message = client.messages.create(
#     model="claude-3-7-sonnet-20250219",
#     max_tokens=8000,
#     messages = data,
#     system = generate_system_prompt()
#     )
#     if message:
#         return jsonify({"data": (message.content)[0].text }), 200
#  except Exception as e:
#         print(f"Error occurred: {e}")
#         return jsonify({"error": "An error occurred while processing the request."}), 500