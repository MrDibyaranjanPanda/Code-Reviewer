import json
import os

from models.review import Review
from models.uploaded_file import UploadedFile
from models.project import Project


def read_python_file(file_path):

    if not os.path.exists(file_path):
        return {
            "error": "File not found"
        }, 404

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            code = file.read()

        return {
            "code": code
        }, 200

    except Exception as e:
        return {
            "error": str(e)
        }, 500


def get_review(user_id, uploaded_file_id):

    uploaded_file = UploadedFile.query.get(uploaded_file_id)

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

    if not review:
        return {
            "error": "Review not found"
        }, 404

    try:
        complete_review = json.loads(review.review)

    except json.JSONDecodeError:
        complete_review = {
            "ai_review": review.review
        }

    return {
        "uploaded_file_id": uploaded_file_id,
        "review": complete_review,
        "created_at": review.created_at
    }, 200

def get_all_reviews(user_id):

    reviews = Review.query.all()

    review_list = []


    for review in reviews:

        uploaded_file = UploadedFile.query.get(
            review.uploaded_file_id
        )


        if not uploaded_file:
            continue


        project = Project.query.filter_by(
            id=uploaded_file.project_id,
            user_id=user_id
        ).first()


        if not project:
            continue


        try:

            review_data = json.loads(
                review.review
            )

        except json.JSONDecodeError:

            review_data = {
                "ai_review": review.review
            }


        ai_review = review_data.get(
            "ai_review",
            {}
        )


        review_list.append({

            "review_id": review.id,

            "uploaded_file_id":
                review.uploaded_file_id,

            "filename":
                uploaded_file.filename,

            "project_name":
                project.project_name,

            "created_at":
                review.created_at,

            "score":
                ai_review.get("score"),

            "severity":
                ai_review.get("severity"),

        })


    return review_list, 200