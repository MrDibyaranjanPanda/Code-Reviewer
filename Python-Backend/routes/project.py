from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.project_service import (
    create_project,
    get_projects,
    get_project_files,
    delete_uploaded_file,
    delete_project
)


project_bp = Blueprint("project", __name__)


@project_bp.route(
    "/projects",
    methods=["POST"]
)
@jwt_required()
def create():

    data = request.get_json()

    project_name = data.get("project_name")
    upload_type = data.get("upload_type")

    user_id = get_jwt_identity()

    response, status_code = create_project(
        user_id,
        project_name,
        upload_type
    )

    return jsonify(response), status_code


@project_bp.route(
    "/projects",
    methods=["GET"]
)
@jwt_required()
def get_all_projects():

    user_id = get_jwt_identity()

    response, status_code = get_projects(
        user_id
    )

    return jsonify(response), status_code


@project_bp.route(
    "/projects/<int:project_id>/files",
    methods=["GET"]
)
@jwt_required()
def get_files(project_id):

    user_id = get_jwt_identity()

    response, status_code = get_project_files(
        user_id,
        project_id
    )

    return jsonify(response), status_code


@project_bp.route(
    "/files/<int:file_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_file(file_id):

    user_id = get_jwt_identity()

    response, status_code = delete_uploaded_file(
        user_id,
        file_id
    )

    return jsonify(response), status_code

@project_bp.route(
    "/projects/<int:project_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_project_route(project_id):

    user_id = get_jwt_identity()

    response, status_code = delete_project(
        user_id,
        project_id
    )

    return jsonify(response), status_code