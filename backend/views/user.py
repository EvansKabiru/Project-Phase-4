from flask import jsonify, request, Blueprint
from models import db, User, Professional
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin


user_bp = Blueprint("user_bp", __name__)

# Fetch all users
@user_bp.route("/api/users", methods=["GET"])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def fetch_users():
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'is_admin': user.is_admin,
        'is_professional': user.is_professional,
        "selected_professionals": [
            {
                "id": professional.id,
                "full_name": professional.full_name,
                "profession_field": professional.profession_field,
                "location": professional.location
            } for professional in user.selected_professionals
        ]
    } for user in users]

    return jsonify(user_list), 200

# Register a new user (with option to register as a professional)
@user_bp.route("/api/users", methods=["POST"])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def add_user():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')  # Expect "password", not "password_hash"
    is_admin = data.get('is_admin', False)
    is_professional = data.get('is_professional', False)

    if not full_name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = generate_password_hash(password)

    new_user = User(full_name=full_name, email=email, password_hash=hashed_password, is_admin=is_admin, is_professional=is_professional)
    db.session.add(new_user)
    db.session.commit()

    # If registering as a professional, add to Professional table
    if is_professional:
        new_professional = Professional(user_id=new_user.id)
        db.session.add(new_professional)
        db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Update user details
@user_bp.route("/api/users/<int:user_id>", methods=["PATCH"])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    user.full_name = data.get('full_name', user.full_name)
    user.email = data.get('email', user.email)

    if 'password' in data and data['password']:
        user.password_hash = generate_password_hash(data['password'])

    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200

# Delete a user
@user_bp.route("/api/users/<int:user_id>", methods=["DELETE"])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200
