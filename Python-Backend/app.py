from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, bcrypt, jwt, migrate

import models
from routes.auth import auth_bp
from routes.project import project_bp
from routes.upload import upload_bp
from routes.review import review_bp
from routes.dashboard import dashboard_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
migrate.init_app(app, db)

CORS(app)

app.register_blueprint(
    auth_bp,
    url_prefix="/auth"
)
app.register_blueprint(project_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(review_bp)
app.register_blueprint(dashboard_bp)

@app.route("/")
def home():
    return {
        "message": "AI Code Review Assistant Backend is Running!"
    }

if __name__ == "__main__":
    app.run(debug=True)