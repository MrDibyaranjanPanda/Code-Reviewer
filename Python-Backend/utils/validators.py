import re


def validate_registration_data(name, email, password):
    if not name or not name.strip():
        return "Name is required"
    
    if not email or not email.strip():
        return "Email is required"
    
    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    if not re.match(email_pattern, email):
        return "Invalid email format"
    
    if not password:
        return "Password is required"
    
    if len(password) < 8:
        return "Password must be at least 8 characters long"
    
    return None

def validate_login_data(email, password):

    if not email or not email.strip():
        return "Email is required"

    if not password:
        return "Password is required"

    return None