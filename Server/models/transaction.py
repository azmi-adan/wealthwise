from datetime import datetime
from .user import db  # Import db from user.py

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign key linking to User
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationship
    user = db.relationship("User", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction (User {self.user_id}): {self.category} - ${self.amount}>"
