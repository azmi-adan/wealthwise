from datetime import datetime
from .user import db  # Import db directly from user.py

class Savings(db.Model):
    __tablename__ = 'savings'

    id = db.Column(db.Integer, primary_key=True)
    current = db.Column(db.Float, nullable=False, default=0.0)
    goal = db.Column(db.Float, nullable=False, default=0.0)
    history = db.Column(db.JSON, nullable=True)  # For tracking savings over time

    # Foreign key linking to User
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationship
    user = db.relationship("User", back_populates="savings")

    def __repr__(self):
        return f"<Savings (User {self.user_id}): ${self.current} / ${self.goal}>"
