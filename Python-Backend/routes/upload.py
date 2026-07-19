from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from services.upload_service import save_uploaded_file

upload_bp = Blueprint("upload", __name__)


@upload_bp.route("/upload/<int:project_id>", methods=["POST"])
@jwt_required()
def upload_file(project_id):

    if "file" not in request.files:
        return jsonify({
            "error": "No file uploaded"
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "error": "No file selected"
        }), 400

    response, status_code = save_uploaded_file(
        project_id,
        file
    )

    return jsonify(response), status_code