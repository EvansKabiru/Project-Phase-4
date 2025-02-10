from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS
from datetime import timedelta

from models import db, TokenBlocklist  # Import database and token blocklist model

app = Flask(__name__)

# Enable CORS
CORS(app, supports_credentials=True, origins=["https://pro-get.vercel.app"])

# Database Configuration (Replace with actual credentials)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://progetdb_user:0JMRlA8d8F04QUWgHViSW770Cp0CPQMN@dpg-cui6m1ggph6c73eh4nrg-a.oregon-postgres.render.com/progetdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Database and Migrations
db.init_app(app)
migrate = Migrate(app, db)

# Flask Mail Configuration (Update with actual email credentials)
app.config["MAIL_SERVER"] = 'smtp.gmail.com'
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = "email1@gmail.com"
app.config["MAIL_PASSWORD"] = "your_password"
app.config["MAIL_DEFAULT_SENDER"] = "email2@gmail.com"

mail = Mail(app)

# JWT Authentication
app.config["JWT_SECRET_KEY"] = "your_secret_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=60)  # Token expires in 60 minutes

jwt = JWTManager(app)

# Import Routes from Views
from views import user_bp, professional_bp, rating_bp, auth_bp

# Register Blueprints for different features
app.register_blueprint(user_bp)
app.register_blueprint(professional_bp)
app.register_blueprint(rating_bp)
app.register_blueprint(auth_bp)

# JWT Token Blocklist (Revoked Token Check)
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None  # Returns True if the token exists (revoked)

# Run App
if __name__ == "__main__":
    app.run(debug=True)