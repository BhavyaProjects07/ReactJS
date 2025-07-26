from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
import re
import logging
logger = logging.getLogger(__name__)

# Configure Gemini API
from decouple import config
genai.configure(api_key=config("GOOGLE_API_KEY"))


# Load the model
model = genai.GenerativeModel('gemini-2.0-flash')


import re

custom_responses = {
    "creator": {
        "keywords": [
            "who made you", "who create you", "who created you", "who develop you", "who developed you",
            "who build you", "who built you", "who generated you", "who generate you",
            "who genrated you", "who genrate you", "who genarated you", "who genarate you",
            "who creater you", "who creted you", "who desined you", "who desinged you",
            "who programmed you", "who program you", "who founded you", "who founder you",
            "who is your creator", "who is your ceo", "who is your founder", "who is your owner",
            "who is your boss", "who is your developer"
        ],
        "response": "I was created by Bhavya, the visionary CEO of Dark AI. I'm here to assist you with whatever you need!"
    },
    "identity": {
        "keywords": [
            "what's your name", "what is your name", "who are you", "what can i call you",
            "what is your identity", "what is your chatbot name", "do you have a name",
            "whats your name", "whats ur name", "what's ur name", "tell me your name",
            "your name please", "name please", "ur name"
        ],
        "response": "I am Dark AI, your personal AI assistant created by Bhavya. Feel free to call me Dark AI!"
    },
    "model": {
        "keywords": [
            "what's your model", "what is your model", "which ai model are you", "what version are you",
            "tell me your version", "are you gpt", "are you gemini", "which model you are",
            "what is your ai model", "what type of ai you are", "what model ai you are"
        ],
        "response": "I am a unique AI model known as Dark AI, custom-built by Bhavya. I’m not GPT or Gemini — I’m something special!"
    },
    "training": {
        "keywords": [
            "who trained you", "what trained you", "where does your knowledge come from",
            "what data were you trained on", "who taught you", "how do you know things",
            "who learn you", "who teached you", "who gives you knowledge", "how you learn"
        ],
        "response": "I was trained with carefully selected knowledge and data, curated by Bhavya. My responses are designed to serve you better every day."
    },
    "purpose": {
        "keywords": [
            "why were you made", "what is your purpose", "what can you do", "why do you exist",
            "what's your job", "what are you capable of", "what you can do", "what you are made for",
            "what is your work", "what you are used for"
        ],
        "response": "I was created by Bhavya to assist, inform, and engage you. My purpose is to make your experience smoother and smarter!"
    },
    "owner": {
        "keywords": [
            "who owns you", "who is your boss", "who controls you", "who is your company",
            "who is your owner", "who have you", "who is your handler", "who is your parent company",
            "who manage you", "who is the owner of dark ai"
        ],
        "response": "I am fully owned and managed by Bhavya, the CEO of Dark AI. There’s no big tech company behind me — just Bhavya’s brilliant vision."
    }
}

def detect_custom_response(user_message):
    user_message_lower = user_message.lower()

    for category, data in custom_responses.items():
        for keyword in data['keywords']:
            if re.search(rf'\b{re.escape(keyword)}\b', user_message_lower):
                return data['response']
    return None




def clean_gemini_response(text):
    if not isinstance(text, str):
        return text

    # Remove bold markdown: **text**
    cleaned = re.sub(r'\*\*(.*?)\*\*', r'\1', text)

    # Remove italic markdown: *text*
    cleaned = re.sub(r'\*(.*?)\*', r'\1', cleaned)

    # Optional: Remove extra spaces at the beginning of lines
    cleaned = re.sub(r'^\s+', '', cleaned, flags=re.MULTILINE)

    return cleaned.strip()


class ChatAPIView(APIView):
    def post(self, request):
        user_message = request.data.get('message')

        if not user_message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check for custom responses first
            custom_reply = detect_custom_response(user_message)
            if custom_reply:
                return Response({"bot_response": custom_reply}, status=status.HTTP_200_OK)

            # Basic keyword detection for code intent
            code_keywords = ["python", "javascript", "code", "program", "script", "function", "write a function", "generate code"]
            is_code_request = any(keyword.lower() in user_message.lower() for keyword in code_keywords)

            # Code generation or normal response
            if is_code_request:
                prompt = f"""
                You are a coding assistant.

                Please generate a COMPLETE code solution for the following request:

                **Request: {user_message}**

                🚨 STRICT Instructions:
                ✅ Return the entire code in ONE markdown block like ```python ... ```
                ✅ Proper indentation is MANDATORY.
                ✅ NO emojis, NO step-by-step lists, NO headings, NO explanations.
                ✅ ONLY include code, no text outside the code block.
                Also an additional instruction:
                If anybody asks about your creator, origin or anything related to your identity, just say:
                "I was created by Bhavya, the CEO of Dark AI. I'm here to assist you with whatever you need!"
                """
            else:
                prompt = f"""
                    You are a helpful AI assistant. Format your responses cleanly and human-like.

                    Instructions:
                    - Use bullet points (•) only for lists
                    - Add a line break **after each bullet point** (important)
                    - Bold all main titles in list items (e.g., • **Mindhunter**)
                    - Add a **newline after title and emoji**, then write description below
                    - No markdown formatting like ** or * or HTML symbols
                    - Keep responses elegant and easy to read

                    Question: {user_message}
"""


            response = model.generate_content(prompt)

            ai_response = response.text if hasattr(response, 'text') else "I couldn't generate a response."

            # If not code, clean the response
            if not is_code_request:
                ai_response = clean_gemini_response(ai_response)

            return Response({"bot_response": ai_response}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





# views.py

import os
import mimetypes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google import genai
from google.genai import types
import cloudinary
import cloudinary.uploader

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_to_cloudinary(file_name, data):
    with open(file_name, "wb") as f:
        f.write(data)
    response = cloudinary.uploader.upload(file_name, folder="darkai/generated/")
    os.remove(file_name)
    return response['secure_url']

class GenerateImageAPIView(APIView):
    def post(self, request):
        prompt = request.data.get("prompt")
        print(f"Received prompt: {prompt}")
        if not prompt:
            return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            model = "gemini-2.0-flash-preview-image-generation"

            contents = [
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=prompt)],
                ),
            ]

            config = types.GenerateContentConfig(
                temperature=1,
                response_modalities=["IMAGE", "TEXT"],
            )

            file_index = 0
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=config,
            ):
                print("📥 Received chunk from Gemini")

                candidate = chunk.candidates[0]
                if not candidate or not candidate.content or not candidate.content.parts:
                    print("⚠️ No candidate content/parts found.")
                    continue

                parts = candidate.content.parts
                print(f"✅ Parts received: {parts}")

                inline_data = parts[0].inline_data if parts[0] else None

                if inline_data and inline_data.data:
                    print("🖼️ Inline image data found. Saving...")

                    file_extension = mimetypes.guess_extension(inline_data.mime_type)
                    file_name = f"generated_image_{file_index}{file_extension}"
                    file_index += 1

                    with open(file_name, "wb") as f:
                        f.write(inline_data.data)

                    print("✅ Image saved locally.")

                    response = cloudinary.uploader.upload(file_name, folder="darkai/generated/")
                    os.remove(file_name)
                    print("☁️ Uploaded to Cloudinary:", response["secure_url"])

                    return Response({"file_name": response["secure_url"]}, status=200)

                else:
                    print("❌ No inline image data in parts.")


        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




from gtts import gTTS
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from gtts.lang import tts_langs
import os, uuid

@method_decorator(csrf_exempt, name='dispatch')
class TextToSpeechView(APIView):
    def post(self, request):
        text = request.data.get("text")
        lang = request.data.get("lang", "es")  # default to English

        if not text:
            return Response({"error": "No text provided"}, status=400)

        # ✅ Validate lang code
        supported_langs = tts_langs()
        if lang not in supported_langs:
            return Response({"error": f"Language '{lang}' not supported."}, status=400)

        # ✅ Ensure the output directory exists
        folder_path = os.path.join("media", "tts")
        os.makedirs(folder_path, exist_ok=True)

        # ✅ Generate filename and full path
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(folder_path, filename)

        # ✅ Generate and save the audio
        tts = gTTS(text=text, lang=lang)
        tts.save(filepath)

        return Response({"audio_url": f"/media/tts/{filename}"})