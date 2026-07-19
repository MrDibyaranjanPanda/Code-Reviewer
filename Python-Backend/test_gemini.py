from services.ai_service import review_python_code

code = """
def add(a,b):
 return a+b
"""

review = review_python_code(code)

print(review)