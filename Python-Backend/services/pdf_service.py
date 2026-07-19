import io
import json
import os

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Preformatted
)

from models.review import Review
from models.uploaded_file import UploadedFile
from models.project import Project


def generate_review_pdf(user_id, uploaded_file_id):

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

    if not review:
        return {
            "error": "Review not found"
        }, 404

    try:

        review_data = json.loads(review.review)

    except json.JSONDecodeError:

        return {
            "error": "Invalid review data"
        }, 500

    ai_review = review_data.get(
        "ai_review",
        {}
    )

    buffer = io.BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=22,
        spaceAfter=10
    )

    heading_style = ParagraphStyle(
        "HeadingStyle",
        parent=styles["Heading2"],
        fontSize=15,
        spaceBefore=16,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        "BodyStyle",
        parent=styles["BodyText"],
        fontSize=10,
        leading=15,
        spaceAfter=8
    )

    small_style = ParagraphStyle(
        "SmallStyle",
        parent=styles["BodyText"],
        fontSize=9,
        leading=12
    )

    code_style = ParagraphStyle(
        "CodeStyle",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8,
        leading=10
    )

    story = []

    # =========================================
    # TITLE
    # =========================================

    story.append(
        Paragraph(
            "AI CODE REVIEW REPORT",
            title_style
        )
    )

    story.append(
        Paragraph(
            f"<b>File:</b> {uploaded_file.filename}",
            body_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Project:</b> {project.project_name}",
            body_style
        )
    )

    story.append(Spacer(1, 10))

    # =========================================
    # AI REVIEW
    # =========================================

    story.append(
        Paragraph(
            "AI Review",
            heading_style
        )
    )

    story.append(
        Paragraph(
            "<b>Summary</b>",
            body_style
        )
    )

    story.append(
        Paragraph(
            str(
                ai_review.get(
                    "summary",
                    "No summary available."
                )
            ),
            body_style
        )
    )

    story.append(
        Paragraph(
            "<b>What the Code Does</b>",
            body_style
        )
    )

    story.append(
        Paragraph(
            str(
                ai_review.get(
                    "what_code_does",
                    "Not available."
                )
            ),
            body_style
        )
    )

    # =========================================
    # ISSUES
    # =========================================

    story.append(
        Paragraph(
            "<b>Issues</b>",
            body_style
        )
    )

    issues = ai_review.get(
        "issues",
        []
    )

    if isinstance(issues, list):

        for issue in issues:

            story.append(
                Paragraph(
                    f"• {issue}",
                    body_style
                )
            )

    else:

        story.append(
            Paragraph(
                str(issues),
                body_style
            )
        )

    # =========================================
    # BEST PRACTICES
    # =========================================

    story.append(
        Paragraph(
            "<b>Best Practices</b>",
            body_style
        )
    )

    best_practices = ai_review.get(
        "best_practices",
        []
    )

    if isinstance(best_practices, list):

        for practice in best_practices:

            story.append(
                Paragraph(
                    f"• {practice}",
                    body_style
                )
            )

    else:

        story.append(
            Paragraph(
                str(best_practices),
                body_style
            )
        )

    # =========================================
    # IMPROVED CODE
    # =========================================

    story.append(
        Paragraph(
            "<b>Improved Code</b>",
            body_style
        )
    )

    improved_code = ai_review.get(
        "improved_code",
        "No improved code available."
    )

    story.append(
        Preformatted(
            str(improved_code),
            code_style
        )
    )

    # =========================================
    # SCORE AND SEVERITY
    # =========================================

    story.append(
        Paragraph(
            "Review Score",
            heading_style
        )
    )

    score = ai_review.get(
        "score",
        "—"
    )

    severity = ai_review.get(
        "severity",
        "—"
    )

    score_table = Table(
        [
            [
                Paragraph("<b>Score</b>", small_style),
                Paragraph("<b>Severity</b>", small_style)
            ],
            [
                str(score),
                str(severity)
            ]
        ],
        colWidths=[2.5 * inch, 2.5 * inch]
    )

    score_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.lightgrey
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER"
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE"
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    8
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    8
                )
            ]
        )
    )

    story.append(score_table)

    # =========================================
    # PYLINT
    # =========================================

    story.append(
        Paragraph(
            "Pylint Results",
            heading_style
        )
    )

    pylint_results = review_data.get(
        "pylint",
        []
    )

    if not pylint_results:

        story.append(
            Paragraph(
                "No Pylint issues found.",
                body_style
            )
        )

    else:

        pylint_data = [
            [
                Paragraph("<b>Issue</b>", small_style),
                Paragraph("<b>Message</b>", small_style),
                Paragraph("<b>Line</b>", small_style)
            ]
        ]

        for issue in pylint_results:

            pylint_data.append(
                [
                    str(
                        issue.get(
                            "symbol",
                            "—"
                        )
                    ),
                    str(
                        issue.get(
                            "message",
                            "—"
                        )
                    ),
                    str(
                        issue.get(
                            "line",
                            "—"
                        )
                    )
                ]
            )

        pylint_table = Table(
            pylint_data,
            colWidths=[
                1.5 * inch,
                3.5 * inch,
                0.7 * inch
            ]
        )

        pylint_table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.lightgrey
                    ),
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.grey
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "TOP"
                    ),
                    (
                        "FONTSIZE",
                        (0, 0),
                        (-1, -1),
                        8
                    )
                ]
            )
        )

        story.append(pylint_table)

    # =========================================
    # BANDIT
    # =========================================

    story.append(
        Paragraph(
            "Bandit Security Results",
            heading_style
        )
    )

    bandit_results = review_data.get(
        "bandit",
        {}
    ).get(
        "results",
        []
    )

    if not bandit_results:

        story.append(
            Paragraph(
                "No security issues found.",
                body_style
            )
        )

    else:

        for issue in bandit_results:

            story.append(
                Paragraph(
                    f"<b>{issue.get('test_name', 'Unknown')}</b>",
                    body_style
                )
            )

            story.append(
                Paragraph(
                    issue.get(
                        "issue_text",
                        "No description available."
                    ),
                    body_style
                )
            )

    # =========================================
    # RADON
    # =========================================

    story.append(
        Paragraph(
            "Radon Code Quality",
            heading_style
        )
    )

    maintainability = review_data.get(
        "radon",
        {}
    ).get(
        "maintainability",
        {}
    )

    if maintainability:

        first_result = list(
            maintainability.values()
        )[0]

        story.append(
            Paragraph(
                f"<b>Maintainability Index:</b> "
                f"{first_result.get('mi', '—')}",
                body_style
            )
        )

        story.append(
            Paragraph(
                f"<b>Maintainability Rank:</b> "
                f"{first_result.get('rank', '—')}",
                body_style
            )
        )

    else:

        story.append(
            Paragraph(
                "No Radon data available.",
                body_style
            )
        )

    # =========================================
    # ORIGINAL CODE
    # =========================================

    story.append(
        PageBreak()
    )

    story.append(
        Paragraph(
            "Original Python Code",
            heading_style
        )
    )

    original_code = review.original_code

    if original_code:

       story.append(
           Preformatted(
               original_code,
               code_style
            )
        )

    else:

        story.append(
            Paragraph(
                "Original code is not available for this review.",
                body_style
            )
        )

    document.build(story)

    buffer.seek(0)

    return buffer, 200