import os
import vertexai
from vertexai.generative_models import GenerativeModel
from pathlib import Path
import re
from dotenv import load_dotenv

load_dotenv()

# load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(BASE_DIR / "gcp-vertex-key.json")

vertexai.init(
    project=os.getenv("GCP_PROJECT_ID"),
    location=os.getenv("GCP_REGION")
)

model = GenerativeModel("gemini-2.0-flash-001")

#  conditioning outputs via system instructions to ensure we get valid JSON output that can be parsed 
# into a workflow definition. We also enforce a strict structure and allowed agent types to 
# ensure the generated workflows are compatible with our execution engine.

def generate_workflow(prompt: str):
    
    system_instruction = """
You generate enterprise workflow definitions.

STRICT RULES:
- Return ONLY valid JSON.
- Do NOT include markdown.
- Do NOT include explanation.
- Do NOT include backticks.
- Do NOT include text before or after JSON.
- Output must start with { and end with }.

Allowed structure:

{
  "nodes": [
    {
      "id": "hr",
      "type": "agent"
    }
  ]
}

Allowed agent ids:
- hr
- it
- procurement

Allowed types:
- agent
- human

Max 200 tokens.
"""
    
    response = model.generate_content(
        system_instruction + "\nUser Request:\n" + prompt,
        generation_config={
            "max_output_tokens": 300,
            "temperature": 0.2
        }
    )
    
    raw_text = response.text.strip()
    print("RAW LLM RESPONSE:", raw_text)
    
    # Extract first JSON object from response safely
    match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if not match:
        raise Exception("No JSON object found in LLM response")

    return match.group(0)