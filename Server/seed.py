from app import db, app
from models.user import User
from models.savings import Savings
from models.transaction import Transaction

# Start the Flask app context
with app.app_context():
    db.drop_all()  # Remove existing tables
    db.create_all()  # Create fresh tables

    # Create Users
    user1 = User(username="azmi", email="azmi@example.com")
    user1.set_password("password123")

    user2 = User(username="john_doe", email="john@example.com")
    user2.set_password("securepassword")

    db.session.add_all([user1, user2])
    db.session.commit()

    # Create Savings for Users
    savings1 = Savings(user_id=user1.id, current=500.0, goal=2000.0, history=[{"date": "2024-02-01", "amount": 100}])
    savings2 = Savings(user_id=user2.id, current=1000.0, goal=5000.0, history=[{"date": "2024-02-10", "amount": 500}])

    db.session.add_all([savings1, savings2])
    db.session.commit()

    # Create Transactions for Users
    transaction1 = Transaction(user_id=user1.id, amount=50.0, category="Food")
    transaction2 = Transaction(user_id=user1.id, amount=100.0, category="Transport")
    transaction3 = Transaction(user_id=user2.id, amount=200.0, category="Shopping")

    db.session.add_all([transaction1, transaction2, transaction3])
    db.session.commit()

    print("Database seeded successfully!")
