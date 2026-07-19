from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import send_file
from services.pdf_service import generate_review_pdf

from services.review_service import (
    get_review,
    get_all_reviews
)

review_bp = Blueprint("review", __name__)


@review_bp.route("/review/<int:uploaded_file_id>", methods=["GET"])
@jwt_required()
def get_review_route(uploaded_file_id):

    user_id = get_jwt_identity()

    response, status_code = get_review(
        user_id,
        uploaded_file_id
    )

    return jsonify(response), status_code

@review_bp.route(
    "/reviews",
    methods=["GET"]
)
@jwt_required()
def get_reviews():

    user_id = get_jwt_identity()


    response, status_code = get_all_reviews(
        user_id
    )


    return jsonify(response), status_code

@review_bp.route(
    "/review/<int:file_id>/pdf",
    methods=["GET"]
)
@jwt_required()
def download_review_pdf(file_id):

    user_id = get_jwt_identity()

    response, status_code = generate_review_pdf(
        user_id,
        file_id
    )

    if status_code != 200:
        return jsonify(response), status_code

    return send_file(
        response,
        as_attachment=True,
        download_name=f"code_review_{file_id}.pdf",
        mimetype="application/pdf"
    )