from services.bandit_service import run_bandit


file_path = r"C:\UploadedPythonFiles\hello.py"

result, status_code = run_bandit(file_path)

print("Status Code:", status_code)
print("Bandit Results:")
print(result)