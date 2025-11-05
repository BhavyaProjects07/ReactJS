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
model = genai.GenerativeModel('gemini-2.5-flash')

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
        is_code_mode = request.data.get('code_mode', False)  # ✅ NEW FIELD FROM FRONTEND

        if not user_message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check for custom responses first
            custom_reply = detect_custom_response(user_message)
            if custom_reply:
                return Response({"bot_response": custom_reply}, status=status.HTTP_200_OK)

            if is_code_mode:  # ✅ Force code mode
                prompt = f"""
                You are a coding assistant.

                Please generate a COMPLETE code solution for the following request:

                Request: {user_message}

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
                You are Dark AI, an advanced assistant.
                ⚡ Always respond in GitHub-flavored Markdown (GFM).

                Formatting rules:
                - Use #, ##, ### for headings
                - Use **bold** for emphasis
                - Use - or 1. for lists
                - Use > for blockquotes
                - Use fenced code blocks ``` for code
                - Add line breaks between sections
                - Keep responses elegant, structured, and easy to scan

                User Query:
                {user_message}
                """


            response = model.generate_content(prompt)
            ai_response = response.text if hasattr(response, 'text') else "I couldn't generate a response."

            if not is_code_mode:
                ai_response = clean_gemini_response(ai_response)

            return Response({"bot_response": ai_response}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- IMAGE GENERATION VIEW ---
import os
import mimetypes
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

class GenerateImageAPIView(APIView):
    def post(self, request):
        prompt = request.data.get("prompt")
        print(f"Received prompt: {prompt}")
        if not prompt:
            return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))
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
                candidate = chunk.candidates[0]
                if not candidate or not candidate.content or not candidate.content.parts:
                    continue

                parts = candidate.content.parts
                inline_data = parts[0].inline_data if parts[0] else None

                if inline_data and inline_data.data:
                    file_extension = mimetypes.guess_extension(inline_data.mime_type)
                    file_name = f"generated_image_{file_index}{file_extension}"
                    file_index += 1

                    with open(file_name, "wb") as f:
                        f.write(inline_data.data)

                    response = cloudinary.uploader.upload(file_name, folder="darkai/generated/")
                    os.remove(file_name)

                    return Response({"file_name": response["secure_url"]}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- TEXT TO SPEECH VIEW ---
from gtts import gTTS
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import uuid
from gtts.lang import tts_langs

@method_decorator(csrf_exempt, name='dispatch')
class TextToSpeechView(APIView):
    def post(self, request):
        text = request.data.get("text")
        lang = request.data.get("lang", "en")

        if not text:
            return Response({"error": "No text provided"}, status=400)

        supported_langs = tts_langs()
        if lang not in supported_langs:
            return Response({"error": f"Language '{lang}' not supported."}, status=400)

        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join("temp", filename)
        os.makedirs("temp", exist_ok=True)

        tts = gTTS(text=text, lang=lang)
        tts.save(filepath)

        try:
            response = cloudinary.uploader.upload(
                filepath,
                resource_type="video",
                folder="darkai/tts/",
                public_id=filename.split(".")[0],
                format="mp3",
                overwrite=True
            )
            cloud_url = response["secure_url"]
        except Exception as e:
            return Response({"error": f"Cloudinary upload failed: {str(e)}"}, status=500)
        finally:
            os.remove(filepath)

        return Response({"audio_url": cloud_url})


# --- AUTH VIEWS (SIGNUP/LOGIN/LOGOUT) ---
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
import random

otp_storage = {}

def generate_otp():
    return str(random.randint(100000, 999999))

@api_view(["POST"])
@permission_classes([AllowAny])
def auth_view(request):
    action = request.data.get("action")

    if action == "signup":
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"error": "All fields are required"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password, is_active=False)
        otp = generate_otp()
        otp_storage[email] = otp

        send_mail(
            "Dark AI - Email Verification",
            f"Your OTP is {otp}",
            "noreply@darkai.com",
            [email],
            fail_silently=False,
        )
        return Response({"message": "Signup successful. Verify with OTP."}, status=201)

    elif action == "verify":
        email = request.data.get("email")
        otp = request.data.get("otp")

        if otp_storage.get(email) != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        try:
            user = User.objects.get(email=email)
            user.is_active = True
            user.save()
            del otp_storage[email]
            return Response({"message": "Email verified successfully"}, status=200)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    elif action == "signin":
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if not user.is_active:
            return Response({"error": "Email not verified"}, status=403)

        user_auth = authenticate(username=user.username, password=password)
        if not user_auth:
            return Response({"error": "Invalid credentials"}, status=400)

        refresh = RefreshToken.for_user(user)
        login(request, user_auth)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username
        }, status=200)

    return Response({"error": "Invalid action"}, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out successfully"}, status=200)


# --- PING VIEW ---
@api_view(["GET"])
@permission_classes([AllowAny])
def ping_view(request):
    return Response({"status": "ok"})
