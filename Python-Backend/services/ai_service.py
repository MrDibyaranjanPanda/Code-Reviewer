import json
import os

from google import genai
from google.genai import types
from dotenv import load_dotenv


load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")

print(
    "GEMINI API KEY LOADED:",
    bool(api_key)
)


client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(
        timeout=120000
    )
)


def review_python_code(code):

    prompt = f"""
You are an expert Python code reviewer.

Review the following Python code.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "summary": "Short summary of the code",
    "what_code_does": "Explain what the code does",
    "issues": [
        "Issue 1",
        "Issue 2"
    ],
    "best_practices": [
        "Suggestion 1",
        "Suggestion 2"
    ],
    "improved_code": "Improved version of the code",
    "score": 85,
    "severity": "Low"
}}

Rules:

- score must be a number from 0 to 100
- severity must be one of: Low, Medium, High, Critical
- Keep the explanation beginner-friendly
- Do not use Markdown code fences
- Return ONLY JSON

Python code:

{code}
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )

        raw_response = response.text.strip()

        print("GEMINI RESPONSE:")
        print(raw_response)

        review_data = json.loads(raw_response)

        return review_data

    except Exception as e:

        print(
            "Gemini API Error:",
            repr(e)
        )

        return {
            "summary": (
                "AI review could not be generated."
            ),
            "what_code_does": "",
            "issues": [],
            "best_practices": [],
            "improved_code": "",
            "score": 0,
            "severity": "Critical"
        }