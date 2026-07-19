import json
import os

from werkzeug.utils import secure_filename

from extensions import db
from models.uploaded_file import UploadedFile
from models.review import Review

from services.review_service import read_python_file
from services.ai_service import review_python_code
from services.pylint_service import run_pylint
from services.bandit_service import run_bandit
from services.radon_service import run_radon


UPLOAD_FOLDER = r"C:\UploadedPythonFiles"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_uploaded_file(project_id, file):

    filename = secure_filename(file.filename)

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(filepath)

    uploaded_file = UploadedFile(
        project_id=project_id,
        filename=filename,
        filepath=filepath
    )

    db.session.add(uploaded_file)
    db.session.commit()

    # Read the uploaded Python file
    file_response, status_code = read_python_file(filepath)

    if status_code != 200:
        return file_response, status_code

    code = file_response["code"]

    # Run Pylint analysis
    pylint_response, pylint_status = run_pylint(filepath)

    if pylint_status != 200:
        return pylint_response, pylint_status

    pylint_results = pylint_response["results"]

    # Run Bandit security analysis
    bandit_response, bandit_status = run_bandit(filepath)

    if bandit_status != 200:
        return bandit_response, bandit_status

    bandit_results = bandit_response["results"]

    # Run Radon code quality analysis
    radon_response, radon_status = run_radon(filepath)

    if radon_status != 200:
        return radon_response, radon_status

    radon_results = radon_response

    # Generate AI review
    review_text = review_python_code(code)

    # Combine Pylint and AI results
    complete_review = {
        "pylint": pylint_results,
        "bandit": bandit_results,
        "radon": radon_results,
        "ai_review": review_text
    }

    # Save complete review to database
    review = Review(
    uploaded_file_id=uploaded_file.id,
    review=json.dumps(complete_review),
    original_code=code
    )

    db.session.add(review)
    db.session.commit()

    return {
        "message": "File uploaded successfully",
        "review": complete_review
    }, 201