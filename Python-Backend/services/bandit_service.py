import json
import subprocess


def run_bandit(file_path):

    try:
        result = subprocess.run(
            [
                "bandit",
                "-f",
                "json",
                "-q",
                file_path
            ],
            capture_output=True,
            text=True
        )

        if not result.stdout.strip():
            return {
                "results": []
            }, 200

        bandit_results = json.loads(result.stdout)

        return {
            "results": bandit_results
        }, 200

    except Exception as e:
        return {
            "error": str(e)
        }, 500