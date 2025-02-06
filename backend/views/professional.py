from flask import jsonify, request, Blueprint
from models import db, Professional, User, Rating
from app import app, mail
from flask_mail import Message

professional_bp = Blueprint("professional_bp", __name__)

# Get all professionals
@professional_bp.route("/professionals", methods=["GET"])
def fetch_professionals():
    professionals = Professional.query.all()
    professional_list = [{
        "id": professional.id,
        "full_name": professional.full_name,
        "email": professional.email,
        "phone_number": professional.phone_number,
        "age": professional.age,
        "location": professional.location,
        "profession_field": professional.profession_field
    } for professional in professionals]

    return jsonify(professional_list), 200

# Get a single professional by ID
@professional_bp.route("/professionals/<int:professional_id>", methods=["GET"])
def fetch_professional(professional_id):
    professional = Professional.query.get(professional_id)
    
    if not professional:
        return jsonify({"error": "Professional not found"}), 404

    professional_data = {
        "id": professional.id,
        "full_name": professional.full_name,
        "email": professional.email,
        "phone_number": professional.phone_number,
        "age": professional.age,
        "location": professional.location,
        "profession_field": professional.profession_field
    }

    return jsonify(professional_data), 200

@app.route('/professionals/<int:professional_id>/ratings', methods=['GET', 'POST','DELETE', 'PATCH', 'OPTIONS'])
def professional_ratings(professional_id):
    if request.method == 'OPTIONS':
        return '', 200  # Preflight request returns 200 OK

    if request.method == 'GET':
        # Your logic to fetch ratings for the professional
        ratings = Rating.query.filter_by(professional_id=professional_id).all()
        return jsonify([rating.to_dict() for rating in ratings]), 200


# Register a new professional
@professional_bp.route("/professionals", methods=["POST"])
def add_professional():
    data = request.get_json()
    
    full_name = data.get("full_name")
    email = data.get("email")
    phone_number = data.get("phone_number")
    age = data.get("age")
    location = data.get("location")
    profession_field = data.get("profession_field")
    user_id = data.get("user_id")
    
    
    if not full_name or not email or not phone_number or not age or not location or not profession_field or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    if Professional.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    new_professional = Professional(
        full_name=full_name,
        email=email,
        phone_number=phone_number,
        age=age,
        location=location,
        profession_field=profession_field,
        user_id=user_id
    )

    db.session.add(new_professional)
    db.session.commit()

    # Send email verification
    try:
        msg = Message(
            subject="Welcome to Pro-Get App!",
            sender=app.config["MAIL_DEFAULT_SENDER"],
            recipients=[email],
            body=f"Dear {full_name},\n\nYou have been successfully registered as a professional on Pro-Get. Welcome aboard!"
        )
        mail.send(msg)
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500

    return jsonify({"message": "Professional registered successfully!"}), 201

# Update a professional
@professional_bp.route("/professionals/<int:professional_id>", methods=["PATCH"])
def update_professional(professional_id):
    professional = Professional.query.get(professional_id)
    
    if not professional:
        return jsonify({"error": "Professional not found"}), 404

    data = request.get_json()
    professional.full_name = data.get("full_name", professional.full_name)
    professional.email = data.get("email", professional.email)
    professional.phone_number = data.get("phone_number", professional.phone_number)
    professional.age = data.get("age", professional.age)
    professional.location = data.get("location", professional.location)
    professional.profession_field = data.get("profession_field", professional.profession_field)
    
    db.session.commit()
    return jsonify({"message": "Professional updated successfully"}), 200

# Delete a professional
@professional_bp.route("/professionals/<int:professional_id>", methods=["DELETE"])
def delete_professional(professional_id):
    professional = Professional.query.get(professional_id)
    
    if not professional:
        return jsonify({"error": "Professional not found"}), 404

    db.session.delete(professional)
    db.session.commit()
    return jsonify({"message": "Professional deleted successfully"}), 200


# Add a professional to user's selected list
@professional_bp.route("/api/users/<int:user_id>/select_professional/<int:professional_id>", methods=["POST"])
def add_professional_to_user(user_id, professional_id):
    user = User.query.get(user_id)
    professional = Professional.query.get(professional_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not professional:
        return jsonify({"error": "Professional not found"}), 404

    if professional in user.selected_professionals:
        return jsonify({"error": "Professional is already selected by the user"}), 400

    user.selected_professionals.append(professional)
    db.session.commit()

    return jsonify({"message": "Professional added to user's selected list"}), 201

# Remove a professional from user's selected list
@professional_bp.route("/api/users/<int:user_id>/remove_professional/<int:professional_id>", methods=["DELETE"])
def remove_professional_from_user(user_id, professional_id):
    user = User.query.get(user_id)
    professional = Professional.query.get(professional_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not professional:
        return jsonify({"error": "Professional not found"}), 404

    if professional not in user.selected_professionals:
        return jsonify({"error": "Professional not in user's selected list"}), 400

    user.selected_professionals.remove(professional)
    db.session.commit()

    return jsonify({"message": "Professional removed from user's selected list"}), 200
