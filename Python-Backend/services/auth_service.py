from flask_jwt_extended import create_access_token
from extensions import db, bcrypt
from models.user import User
from utils.validators import (
    validate_registration_data,
    validate_login_data
)

def register_user(name, email, password):

    validation_error = validate_registration_data(name, email, password)

    if validation_error:
        return {"error": validation_error}, 400

    # check if the email already exists
    existing_user  = User.query.filter_by(email=email).first()

    if existing_user:
        return {"error": "Email already exists"}, 400
    
    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create a new user
    user = User(
        name=name,
        email=email,
        password_hash=hashed_password
    )

    # save to database
    db.session.add(user)
    db.session.commit()

    return {"message": "User registered successfully"}, 201

def login_user(email, password):

    validation_error = validate_login_data(email, password)

    if validation_error:
        return {"error": validation_error}, 400

    # Find user by email
    user = User.query.filter_by(email=email).first()

    if not user:
        return {"error": "Invalid email or password"}, 401

    # Verify password
    if not bcrypt.check_password_hash(user.password_hash, password):
        return {"error": "Invalid email or password"}, 401

    # Generate JWT token
    access_token = create_access_token(identity=str(user.id))

    return {
        "message": "Login successful",
        "access_token": access_token
    }, 200