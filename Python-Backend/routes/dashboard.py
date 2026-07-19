from flask import Blueprint, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from services.dashboard_service import (
    get_dashboard_stats
)


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


@dashboard_bp.route(
    "/dashboard/stats",
    methods=["GET"]
)
@jwt_required()
def dashboard_stats():

    user_id = get_jwt_identity()


    response, status_code = get_dashboard_stats(
        user_id
    )


    return jsonify(response), status_code