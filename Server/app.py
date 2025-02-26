from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from config import Config
from models.user import db, User
from models.savings import Savings
from models.transaction import Transaction
from werkzeug.security import generate_password_hash, check_password_hash
import os

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = os.getenv("SECRET_KEY", "mysecretkey")

# Initialize database, migration, CORS, and API
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True)
api = Api(app)

# =====================================
#            AUTH RESOURCES
# =====================================

class Register(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return {"error": "Missing fields"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        user = User(username=username, email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return {"message": "User registered successfully", "user": {"id": user.id, "username": user.username}}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"error": "Invalid credentials"}, 401

        session["user_id"] = user.id
        return {"message": "Login successful", "user": {"id": user.id, "username": user.username}}, 200

class Logout(Resource):
    def post(self):
        session.pop("user_id", None)
        return {"message": "Logged out successfully"}, 200

# =====================================
#           USER RESOURCE
# =====================================

class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if not user:
                return {"error": "User not found"}, 404
            return {"id": user.id, "username": user.username, "email": user.email}
        
        users = User.query.all()
        return [{"id": user.id, "username": user.username, "email": user.email} for user in users]

# =====================================
#           SAVINGS RESOURCE
# =====================================

class SavingsResource(Resource):
    def get(self, savings_id):  # Change from user_id to savings_id
        savings = Savings.query.get(savings_id)
        if not savings:
            return {"error": "No savings found"}, 404
        return {"id": savings.id, "current": savings.current, "goal": savings.goal, "history": savings.history}

    def post(self):
        data = request.get_json()
        user_id = data.get("user_id")  # Get user_id from request body
        current = data.get("current", 0.0)
        goal = data.get("goal", 0.0)

        if not user_id:
            return {"error": "user_id is required"}, 400

        savings = Savings(user_id=user_id, current=current, goal=goal, history=[])
        db.session.add(savings)
        db.session.commit()

        return {"message": "Savings record created", "savings_id": savings.id}, 201

    def put(self, savings_id):
        data = request.get_json()
        savings = Savings.query.get(savings_id)

        if not savings:
            return {"error": "Savings record not found"}, 404

        savings.current = data.get("current", savings.current)
        savings.goal = data.get("goal", savings.goal)
        
        if "history" in data:
            savings.history = data["history"]

        db.session.commit()
        return {"message": "Savings updated"}, 200

# =====================================
#         TRANSACTIONS RESOURCE
# =====================================

class TransactionResource(Resource):
    def get(self, user_id):
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        return [
            {
                "id": t.id,
                "amount": t.amount,
                "category": t.category,
                "date": t.date.strftime("%Y-%m-%d %H:%M:%S") if t.date else None  # Convert datetime to string
            }
            for t in transactions
        ]
    def post(self, user_id):
        data = request.get_json()
        amount = data.get("amount")
        category = data.get("category")

        if not amount or not category:
            return {"error": "Missing fields"}, 400

        transaction = Transaction(user_id=user_id, amount=amount, category=category)
        db.session.add(transaction)
        db.session.commit()

        return {"message": "Transaction added"}, 201

    def delete(self, transaction_id):
        transaction = Transaction.query.get(transaction_id)
        if not transaction:
            return {"error": "Transaction not found"}, 404

        db.session.delete(transaction)
        db.session.commit()
        return {"message": "Transaction deleted"}, 200

# =====================================
#         ADD RESOURCES TO API
# =====================================

api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(UserResource, "/users", "/users/<int:user_id>")
api.add_resource(SavingsResource, "/savings", "/savings/<int:savings_id>")
api.add_resource(TransactionResource, "/transactions/<int:user_id>", "/transaction/<int:transaction_id>")


# =====================================
#            SERVER INIT
# =====================================
if __name__ == "__main__":
    app.run(debug=True)
