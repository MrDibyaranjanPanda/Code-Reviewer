from extensions import db
from datetime import datetime


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    uploaded_file_id = db.Column(
        db.Integer,
        db.ForeignKey("uploaded_files.id"),
        nullable=False
    )

    review = db.Column(
        db.Text,
        nullable=False
    )

    original_code = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )