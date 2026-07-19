from services.pylint_service import run_pylint


file_path = "uploads/hello.py"

result, status_code = run_pylint(file_path)

print("Status Code:", status_code)
print("Pylint Results:")
print(result)