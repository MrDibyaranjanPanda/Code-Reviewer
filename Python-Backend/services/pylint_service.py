import json
import subprocess


def run_pylint(file_path):

    try:
        result = subprocess.run(
            [
                "pylint",
                file_path,
                "--output-format=json"
            ],
            capture_output=True,
            text=True
        )

        pylint_results = json.loads(result.stdout)

        return {
            "results": pylint_results
        }, 200

    except Exception as e:
        return {
            "error": str(e)
        }, 500