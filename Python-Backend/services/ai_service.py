import json
import os
import time

from google import genai
from dotenv import load_dotenv


load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")

print(
    "GEMINI API KEY LOADED:",
    bool(api_key)
)


client = genai.Client(
    api_key=api_key
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

    for attempt in range(3):

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
                f"Gemini API Error "
                f"(Attempt {attempt + 1}):",
                repr(e)
            )

            if attempt < 2:

                time.sleep(5)

            else:

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