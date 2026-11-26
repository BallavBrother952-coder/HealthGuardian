
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from database import get_db_connection, initialize_database

app = Flask(__name__)
CORS(app)

# Create database table when application starts
initialize_database()


@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to Health Guardian Backend!",
        "status": "Running"
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "success": True,
        "message": "Health Guardian API is working!"
    })


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must contain at least 8 characters"
        }), 400

    password_hash = generate_password_hash(password)

    connection = get_db_connection()

    try:
        connection.execute(
            """INSERT INTO users (name, email, password_hash)
               VALUES (?, ?, ?)""",
            (name, email, password_hash)
        )
        connection.commit()

        return jsonify({
            "success": True,
            "message": "User registered successfully!"
        }), 201

    except Exception as error:
        if "UNIQUE constraint failed" in str(error):
            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 409
        return jsonify({
            "success": False,
            "message": "Registration failed"
        }), 500

    finally:
        connection.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
