from flask import jsonify, request, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin


auth_bp = Blueprint("auth_bp", __name__)

# Login
@auth_bp.route("/api/auth/login", methods=["POST"])  # Match frontend route
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "is_professional": user.is_professional,
                "is_admin": user.is_admin
            }
        }), 200
    else:
        return jsonify({"error": "Either email/password is incorrect"}), 401

# Get current user details
@auth_bp.route("/api/current_user", methods=["GET"])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
@jwt_required()
def current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "full_name":user.full_name,
        "email": user.email,
        "password_hash": user.password_hash,
        "is_admin": user.is_admin,
        "is_professional": user.is_professional
    })

# Logout
@auth_bp.route("/api/logout", methods=["DELETE"])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success": "Logged out successfully"})
