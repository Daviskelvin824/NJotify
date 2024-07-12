from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

API_URL = "https://api-inference.huggingface.co/models/TyoCre/whisper-tiny-english"
headers = {"Authorization": f"Bearer {os.getenv('HUGGING_FACE_API_TOKEN')}"}

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = 'uploaded_audio.flac'
    file.save(filename)
    result = query(filename)
    print(result)
    
    transcription = result.get('text', '')
    return jsonify({'transcription': transcription})

if __name__ == '__main__':
    app.run(debug=True)
