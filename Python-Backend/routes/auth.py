from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.auth_service import register_user, login_user
from models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    response, status_code = register_user(
        name,
        email,
        password
    )

    return jsonify(response), status_code

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    response, status_code = login_user(
        email,
        password
    )

    return jsonify(response), status_code

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }), 200