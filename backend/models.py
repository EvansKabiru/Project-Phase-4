from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import relationship
from itsdangerous import URLSafeTimedSerializer
from flask import current_app 
from datetime import datetime

# Metadata for managing the database schema
metadata = MetaData()

# Initialize SQLAlchemy with metadata
db = SQLAlchemy(metadata=metadata)

from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

# Association table for many-to-many relationship between users and professionals
user_professional = db.Table(
    'user_professional',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('professional_id', db.Integer, db.ForeignKey('professional.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_professional = db.Column(db.Boolean, default=False)  # Added field to check if user is a professional
    
    # Relationship to Professional model (if they register as a professional)
    professional = db.relationship('Professional', backref='user', uselist=False)

    # Many-to-Many Relationship with Professionals
    selected_professionals = db.relationship(
        'Professional',
        secondary=user_professional,
        back_populates='selected_by_users'
    )

    ratings = db.relationship('Rating', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Professional(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    profession_field = db.Column(db.String(255), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)  # Track if email is verified

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Link to the user


    def generate_verification_token(self):
        serializer = URLSafeTimedSerializer(current_app.config['JWT_SECRET_KEY'])
        return serializer.dumps(self.email, salt="email-confirmation")

    @staticmethod
    def verify_token(token, expiration=3600):
        serializer = URLSafeTimedSerializer(current_app.config['JWT_SECRET_KEY'])
        try:
            email = serializer.loads(token, salt="email-confirmation", max_age=expiration)
            return email
        except:
            return None
    
    # Many-to-Many Relationship with Users (Explicit)
    selected_by_users = db.relationship(
        'User',
        secondary=user_professional,
        back_populates='selected_professionals'
    )


    ratings = db.relationship('Rating', backref='professional', lazy=True)

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('professional.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # Example: 1-5 stars
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'professional_id': self.professional_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
