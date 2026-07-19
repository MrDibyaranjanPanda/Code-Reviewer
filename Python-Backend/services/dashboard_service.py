import json

from models.project import Project
from models.review import Review
from models.uploaded_file import UploadedFile


def get_dashboard_stats(user_id):

    # Total projects
    total_projects = Project.query.filter_by(
        user_id=user_id
    ).count()


    # Get all projects owned by the user
    projects = Project.query.filter_by(
        user_id=user_id
    ).all()


    project_ids = [
        project.id
        for project in projects
    ]


    # Get uploaded files from user's projects
    uploaded_files = UploadedFile.query.filter(
        UploadedFile.project_id.in_(project_ids)
    ).all()


    uploaded_file_ids = [
        uploaded_file.id
        for uploaded_file in uploaded_files
    ]


    # Get reviews
    reviews = Review.query.filter(
        Review.uploaded_file_id.in_(uploaded_file_ids)
    ).all()


    total_reviews = len(reviews)

    total_issues = 0


    for review in reviews:

        try:

            review_data = json.loads(
                review.review
            )


            pylint_issues = review_data.get(
                "pylint",
                []
            )


            bandit_data = review_data.get(
                "bandit",
                {}
            )


            bandit_issues = bandit_data.get(
                "results",
                []
            )


            total_issues += len(
                pylint_issues
            )


            total_issues += len(
                bandit_issues
            )


        except json.JSONDecodeError:

            continue


    return {

        "total_projects": total_projects,

        "total_reviews": total_reviews,

        "total_issues": total_issues

    }, 200