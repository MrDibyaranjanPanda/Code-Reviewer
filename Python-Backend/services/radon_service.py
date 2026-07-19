import json
import subprocess


def run_radon(file_path):

    try:
        complexity_result = subprocess.run(
            [
                "radon",
                "cc",
                file_path,
                "-j"
            ],
            capture_output=True,
            text=True
        )

        maintainability_result = subprocess.run(
            [
                "radon",
                "mi",
                file_path,
                "-j"
            ],
            capture_output=True,
            text=True
        )

        complexity = json.loads(complexity_result.stdout)
        maintainability = json.loads(
            maintainability_result.stdout
        )

        return {
            "complexity": complexity,
            "maintainability": maintainability
        }, 200

    except Exception as e:
        return {
            "error": str(e)
        }, 500