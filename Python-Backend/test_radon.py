from services.radon_service import run_radon


file_path = r"C:\UploadedPythonFiles\hello.py"

result, status_code = run_radon(file_path)

print("Status Code:", status_code)
print("Radon Results:")
print(result)