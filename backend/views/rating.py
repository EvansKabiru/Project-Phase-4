from flask import jsonify, request, Blueprint
from models import db, Rating, User, Professional
from datetime import datetime

rating_bp = Blueprint("rating_bp", __name__)

# Get all ratings
@rating_bp.route("/ratings", methods=["GET"])
def fetch_ratings():
    ratings = Rating.query.all()
    
    rating_list = [{
        "id": rating.id,
        "user_id": rating.user_id,
        "professional_id": rating.professional_id,
        "rating": rating.rating,
        "comment": rating.comment,
        "created_at": rating.created_at,
        "user": {
            "id": rating.user.id,
            "full_name": rating.user.full_name,
            "email": rating.user.email
        },
        "professional": {
            "id": rating.professional.id,
            "full_name": rating.professional.full_name,
            "profession_field": rating.professional.profession_field
        }
    } for rating in ratings]

    return jsonify(rating_list), 200

# Get a single rating by ID
@rating_bp.route("/ratings/<int:rating_id>", methods=["GET"])
def fetch_rating(rating_id):
    rating = Rating.query.get(rating_id)
    
    if not rating:
        return jsonify({"error": "Rating not found"}), 404

    rating_data = {
        "id": rating.id,
        "user_id": rating.user_id,
        "professional_id": rating.professional_id,
        "rating": rating.rating,
        "comment": rating.comment,
        "created_at": rating.created_at,
        "user": {
            "id": rating.user.id,
            "full_name": rating.user.full_name,
            "email": rating.user.email
        },
        "professional": {
            "id": rating.professional.id,
            "full_name": rating.professional.full_name,
            "profession_field": rating.professional.profession_field
        }
    }

    return jsonify(rating_data), 200

# Create a new rating
@rating_bp.route("/ratings", methods=["POST"])
def add_rating():
    data = request.get_json()

    user_id = data.get("user_id")
    professional_id = data.get("professional_id")
    rating_value = data.get("rating")
    comment = data.get("comment")
    created_at = data.get("created_at")

    if not user_id or not professional_id or not rating_value or not comment or not created_at:
        return jsonify({"error": "Missing required fields"}), 400

    if not (1 <= rating_value <= 5):
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    user = User.query.get(user_id)
    professional = Professional.query.get(professional_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not professional:
        return jsonify({"error": "Professional not found"}), 404

    new_rating = Rating(
        user_id=user_id,
        professional_id=professional_id,
        rating=rating_value,
        comment=comment
    )

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": "Rating added successfully!"}), 201

# Update an existing rating
@rating_bp.route("/ratings/<int:rating_id>", methods=["PATCH"])
def update_rating(rating_id):
    rating = Rating.query.get(rating_id)

    if not rating:
        return jsonify({"error": "Rating not found"}), 404

    data = request.get_json()
    rating.rating = data.get("rating", rating.rating)
    rating.comment = data.get("comment", rating.comment)

    if rating.rating < 1 or rating.rating > 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    db.session.commit()
    return jsonify({"message": "Rating updated successfully"}), 200

# Delete a rating
@rating_bp.route("/ratings/<int:rating_id>", methods=["DELETE"])
def delete_rating(rating_id):
    rating = Rating.query.get(rating_id)

    if not rating:
        return jsonify({"error": "Rating not found"}), 404

    db.session.delete(rating)
    db.session.commit()
    return jsonify({"message": "Rating deleted successfully"}), 200
