import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google import genai
from google.genai import types
from .models import GeneratedImage
from .serializers import GeneratedImageSerializer
from PIL import Image
import base64
import mimetypes
import time
import os
from io import BytesIO
import cloudinary.uploader
from decouple import config

# 🔧 Configure logger
logger = logging.getLogger(__name__)

class ImageGenerateAPIView(APIView):
    def post(self, request):
        prompt = request.data.get('prompt')

        logger.debug("🔍 API called")
        logger.debug("📝 Prompt received: %s", prompt)
        print(f"Prompt received: {prompt}")
        if not prompt:
            logger.warning("❌ Prompt missing from request")
            return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 🔐 Log environment variable presence
            logger.debug("🔐 Env - CLOUDINARY_CLOUD_NAME: %s", os.getenv("CLOUDINARY_CLOUD_NAME"))
            logger.debug("🔐 Env - CLOUDINARY_API_KEY: %s", os.getenv("CLOUDINARY_API_KEY"))
            logger.debug("🔐 Env - CLOUDINARY_API_SECRET: %s", os.getenv("CLOUDINARY_API_SECRET"))
            logger.debug("🔐 Env - GOOGLE_API_KEY: %s", config("GOOGLE_API_KEY", default="Not Found"))

            client = genai.Client(api_key=config("GOOGLE_API_KEY"))
            model = "gemini-2.0-flash-preview-image-generation"
            contents = [types.Content(role="user", parts=[types.Part.from_text(text=prompt)])]
            generate_content_config = types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
                response_mime_type="text/plain"
            )

            file_index = 0
            image_url = None
            file_name = None

            logger.debug("⚙️ Starting Gemini image generation...")

            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=generate_content_config,
            ):
                if (
                    not chunk.candidates
                    or not chunk.candidates[0].content
                    or not chunk.candidates[0].content.parts
                ):
                    logger.warning("⚠️ Empty chunk from Gemini, skipping")
                    continue

                part = chunk.candidates[0].content.parts[0]

                if hasattr(part, "inline_data") and part.inline_data and part.inline_data.data:
                    inline_data = part.inline_data
                    raw_data = inline_data.data
                    mime_type = inline_data.mime_type
                    logging.warning(f"⚠️ Raw data length: {len(raw_data)}")
                    logging.warning(f"⚠️ Inline Data Mime Type: {mime_type}")

                    try:
                        image_bytes = base64.b64decode(inline_data.data)
                        img = Image.open(BytesIO(image_bytes))
                        img.load()  # safer than verify()

                        img = img.convert("RGB")  # normalize
                        logging.warning("✅ Image loaded successfully")
                        # Add quick size check
                        if len(image_bytes) < 1024:
                            logging.warning("⚠️ Image too small to be valid: %d bytes", len(image_bytes))
                            return Response({"error": "Image is too small to be valid"}, status=400)

                        logging.info("✅ Image verified")
                    except Exception as e:
                        logging.exception("❌ Invalid image")
                        return Response({"error": "Invalid image file from Gemini"}, status=400)



                    file_extension = mimetypes.guess_extension(inline_data.mime_type) or ".png"
                    file_name = f"generated_image_{int(time.time())}_{file_index}{file_extension}"
                    data_buffer = BytesIO(image_bytes)
                    data_buffer.seek(0)

                    logger.debug("🚀 Uploading to Cloudinary with filename: %s", file_name)

                    try:
                        upload_result = cloudinary.uploader.upload(
                            data_buffer,
                            resource_type="image",
                            public_id=file_name,
                            folder="generated_images"
                        )
                        image_url = upload_result.get("secure_url")
                        logger.debug("✅ Cloudinary Upload Successful: %s", image_url)
                    except Exception as e:
                        logger.error("❌ Cloudinary Upload Failed: %s", e)
                        return Response({"error": "Cloudinary upload failed"}, status=500)

                    break

                elif hasattr(part, "text"):
                    logger.info("💬 Gemini Text Response: %s", part.text)

            if not image_url:
                logger.error("❌ Image generation failed — no valid image_url")
                return Response({"error": "Image generation failed."}, status=status.HTTP_400_BAD_REQUEST)

            generated_image = GeneratedImage.objects.create(
                prompt=prompt,
                file_name=image_url
            )
            logger.debug("🗃️ Image saved to DB: %s", generated_image.file_name)

            serializer = GeneratedImageSerializer(generated_image)
            logger.debug("📤 Returning response")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception("🔥 Exception caught during image generation")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

