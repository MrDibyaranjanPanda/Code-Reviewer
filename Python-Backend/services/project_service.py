import os

from extensions import db
from models.project import Project
from models.uploaded_file import UploadedFile
from models.review import Review


def create_project(user_id, project_name, upload_type):

    if not project_name or not project_name.strip():
        return {
            "error": "Project name is required"
        }, 400

    project = Project(
        user_id=user_id,
        project_name=project_name.strip(),
        upload_type=upload_type
    )

    db.session.add(project)
    db.session.commit()

    return {
        "message": "Project created successfully"
    }, 201


def get_projects(user_id):

    projects = Project.query.filter_by(user_id=user_id).all()

    project_list = []

    for project in projects:
        project_list.append({
            "id": project.id,
            "project_name": project.project_name,
            "upload_type": project.upload_type,
            "created_at": project.created_at
        })

    return project_list, 200


def get_project_files(user_id, project_id):

    project = Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()

    if not project:
        return {
            "error": "Project not found or access denied"
        }, 404

    files = UploadedFile.query.filter_by(
        project_id=project_id
    ).all()

    return {
        "files": [
            {
                "id": file.id,
                "filename": file.filename,
                "uploaded_at": file.uploaded_at
            }
            for file in files
        ]
    }, 200

def delete_uploaded_file(user_id, uploaded_file_id):

    uploaded_file = UploadedFile.query.get(
        uploaded_file_id
    )

    if not uploaded_file:
        return {
            "error": "File not found"
        }, 404

    project = Project.query.filter_by(
        id=uploaded_file.project_id,
        user_id=user_id
    ).first()

    if not project:
        return {
            "error": "Access denied"
        }, 403

    review = Review.query.filter_by(
        uploaded_file_id=uploaded_file_id
    ).first()

    if review:
        db.session.delete(review)

    if os.path.exists(uploaded_file.filepath):
        os.remove(uploaded_file.filepath)

    db.session.delete(uploaded_file)

    db.session.commit()

    return {
        "message": "File deleted successfully"
    }, 200

def delete_project(user_id, project_id):

    project = Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()

    if not project:
        return {
            "error": "Project not found or access denied"
        }, 404

    uploaded_files = UploadedFile.query.filter_by(
        project_id=project_id
    ).all()

    for uploaded_file in uploaded_files:

        review = Review.query.filter_by(
            uploaded_file_id=uploaded_file.id
        ).first()

        if review:
            db.session.delete(review)

        if os.path.exists(uploaded_file.filepath):
            os.remove(uploaded_file.filepath)

        db.session.delete(uploaded_file)

    db.session.delete(project)

    db.session.commit()

    return {
        "message": "Project deleted successfully"
    }, 200
