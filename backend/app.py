
import os
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
from google import genai

from database import get_db_connection, initialize_database


# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Initialize database tables
initialize_database()


# ---------------------------------
# HOME API
# ---------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to Health Guardian Backend!",
        "status": "Running"
    })


# ---------------------------------
# HEALTH CHECK API
# ---------------------------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "success": True,
        "message": "Health Guardian API is working!"
    })


# ---------------------------------
# USER REGISTRATION API
# ---------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data"
        }), 400

    name = data.get("name", "")
    email = data.get("email", "")
    password = data.get("password", "")

    if not all(isinstance(value, str) for value in [name, email, password]):
        return jsonify({
            "success": False,
            "message": "Invalid input format"
        }), 400

    name = name.strip()
    email = email.strip().lower()

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
            """
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
            """,
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

        app.logger.exception("Registration error")

        return jsonify({
            "success": False,
            "message": "Registration failed"
        }), 500

    finally:
        connection.close()


# ---------------------------------
# GEMINI AI HEALTH CHATBOT API
# ---------------------------------

@app.route("/api/chat", methods=["POST"])
def health_chat():

    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data"
        }), 400

    message = data.get("message", "")

    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "success": False,
            "message": "Please enter a question"
        }), 400

    if len(message) > 4000:
        return jsonify({
            "success": False,
            "message": "Message must be under 4000 characters"
        }), 400

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return jsonify({
            "success": False,
            "message": "Gemini API key is not configured"
        }), 500

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=message.strip(),
            config={
                "system_instruction": (
                    "You are Health Guardian, a responsible health "
                    "information assistant. Answer health-related "
                    "questions in simple and understandable language. "
                    "Explain common health terms and provide general "
                    "health education. Do not diagnose diseases, "
                    "prescribe medicines, or replace professional "
                    "medical advice. Encourage users to consult "
                    "qualified healthcare professionals. If a user "
                    "describes a possible medical emergency, advise "
                    "them to seek immediate emergency medical care."
                ),
                "temperature": 0.4,
                "max_output_tokens": 700
            }
        )

        reply = response.text

        if not reply:
            return jsonify({
                "success": False,
                "message": "No response received. Please try again."
            }), 502

        return jsonify({
            "success": True,
            "reply": reply
        }), 200

    except Exception:
        app.logger.exception("Gemini chatbot error")

        return jsonify({
            "success": False,
            "message": "The chatbot is temporarily unavailable. Please try again."
        }), 502


# ---------------------------------
# BLOOD DONOR REGISTRATION API
# ---------------------------------

# ---------------------------------
# SEARCH BLOOD DONORS API
# ---------------------------------

@app.route("/api/donors", methods=["GET"])
def search_donors():

    blood_group = request.args.get("blood_group", "").strip().upper()
    city = request.args.get("city", "").strip()

    valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

    if blood_group and blood_group not in valid_groups:
        return jsonify({
            "success": False,
            "message": "Invalid blood group"
        }), 400

    query = """
        SELECT id, name, age, phone, blood_group, city
        FROM donors
        WHERE available = 1
    """
    parameters = []

    if blood_group:
        query += " AND blood_group = ?"
        parameters.append(blood_group)

    if city:
        query += " AND LOWER(city) = LOWER(?)"
        parameters.append(city)

    connection = get_db_connection()

    try:
        donors = connection.execute(
            query, parameters
        ).fetchall()

        return jsonify({
            "success": True,
            "total_donors": len(donors),
            "donors": [dict(donor) for donor in donors]
        }), 200

    except Exception:
        app.logger.exception("Donor search error")
        return jsonify({
            "success": False,
            "message": "Unable to search donors"
        }), 500

    finally:
        connection.close()

@app.route("/api/donors", methods=["POST"])
def register_donor():

    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data"
        }), 400

    name = data.get("name", "")
    age = data.get("age")
    phone = data.get("phone", "")
    email = data.get("email", "")
    blood_group = data.get("blood_group", "")
    city = data.get("city", "")

    if not all(isinstance(value, str) for value in
               [name, phone, email, blood_group, city]):
        return jsonify({
            "success": False,
            "message": "Invalid input format"
        }), 400

    name = name.strip()
    phone = phone.strip()
    email = email.strip().lower()
    blood_group = blood_group.strip().upper()
    city = city.strip()

    if not all([name, phone, email, blood_group, city]) or age is None:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    try:
        age = int(age)
    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Age must be a valid number"
        }), 400

    if age < 18 or age > 65:
        return jsonify({
            "success": False,
            "message": "Donor age must be between 18 and 65"
        }), 400

    valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

    if blood_group not in valid_groups:
        return jsonify({
            "success": False,
            "message": "Invalid blood group"
        }), 400

    connection = get_db_connection()

    try:
        cursor = connection.execute(
            """
            INSERT INTO donors
            (name, age, phone, email, blood_group, city)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (name, age, phone, email, blood_group, city)
        )

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Donor registered successfully!",
            "donor_id": cursor.lastrowid
        }), 201

    except Exception as error:
        if "UNIQUE constraint failed" in str(error):
            return jsonify({
                "success": False,
                "message": "This email is already registered"
            }), 409

        app.logger.exception("Donor registration error")

        return jsonify({
            "success": False,
            "message": "Donor registration failed"
        }), 500

    finally:
        connection.close()
@app.route("/api/donors/<int:donor_id>/availability", methods=["PUT"])
def update_donor_availability(donor_id):
    data = request.get_json()

    if not data or "available" not in data:
        return jsonify({
            "success": False,
            "message": "Availability status is required"
        }), 400

    available = data["available"]

    if not isinstance(available, bool):
        return jsonify({
            "success": False,
            "message": "Availability must be true or false"
        }), 400

    connection = get_db_connection()

    try:
        cursor = connection.execute(
            "UPDATE donors SET available = ? WHERE id = ?",
            (int(available), donor_id)
        )
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "success": False,
                "message": "Donor not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Donor availability updated successfully",
            "available": available
        }), 200

    except Exception:
        app.logger.exception("Donor availability update error")
        return jsonify({
            "success": False,
            "message": "Unable to update donor availability"
        }), 500

    finally:
        connection.close()
    
        connection.close()
    required_fields = [
        "patient_name", "blood_group", "units",
        "hospital", "city", "contact"
    ]

    if not data or any(not data.get(field) for field in required_fields):
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    blood_group = str(data["blood_group"]).strip().upper()
    valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

    if blood_group not in valid_groups:
        return jsonify({
            "success": False,
            "message": "Invalid blood group"
        }), 400

    try:
        units = int(data["units"])
        if units <= 0:
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Units must be a positive number"
        }), 400

    urgency = str(data.get("urgency", "Normal")).strip().title()

    if urgency not in ["Normal", "Urgent", "Critical"]:
        return jsonify({
            "success": False,
            "message": "Invalid urgency level"
        }), 400

    connection = get_db_connection()

    try:
        cursor = connection.execute("""
            INSERT INTO blood_requests
            (patient_name, blood_group, units, hospital, city, contact, urgency)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            str(data["patient_name"]).strip(),
            blood_group,
            units,
            str(data["hospital"]).strip(),
            str(data["city"]).strip(),
            str(data["contact"]).strip(),
            urgency
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Blood request submitted successfully",
            "request_id": cursor.lastrowid
        }), 201

    except Exception:
        app.logger.exception("Blood request creation error")
        return jsonify({
            "success": False,
            "message": "Unable to submit blood request"
        }), 500

    finally:
        connection.close()
@app.route("/api/blood-requests", methods=["POST"])
def create_blood_request():
    data = request.get_json()

    required_fields = ["patient_name", "blood_group", "units", "hospital", "city", "contact"]

    if not data or any(not data.get(field) for field in required_fields):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    blood_group = str(data["blood_group"]).strip().upper()
    valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

    if blood_group not in valid_groups:
        return jsonify({"success": False, "message": "Invalid blood group"}), 400

    try:
        units = int(data["units"])
        if units <= 0:
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Units must be a positive number"}), 400

    urgency = str(data.get("urgency", "Normal")).strip().title()

    if urgency not in ["Normal", "Urgent", "Critical"]:
        return jsonify({"success": False, "message": "Invalid urgency level"}), 400

    connection = get_db_connection()

    try:
        cursor = connection.execute(
            """INSERT INTO blood_requests
            (patient_name, blood_group, units, hospital, city, contact, urgency)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                str(data["patient_name"]).strip(),
                blood_group,
                units,
                str(data["hospital"]).strip(),
                str(data["city"]).strip(),
                str(data["contact"]).strip(),
                urgency
            )
        )

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Blood request submitted successfully",
            "request_id": cursor.lastrowid
        }), 201

    except Exception:
        app.logger.exception("Blood request creation error")
        return jsonify({"success": False, "message": "Unable to submit blood request"}), 500

    finally:
        connection.close()
@app.route("/api/blood-requests", methods=["GET"])
def get_blood_requests():
    connection = get_db_connection()

    try:
        requests = connection.execute("""
            SELECT * FROM blood_requests
            ORDER BY created_at DESC
        """).fetchall()

        return jsonify({
            "success": True,
            "total_requests": len(requests),
            "requests": [dict(item) for item in requests]
        }), 200

    except Exception:
        app.logger.exception("Blood request retrieval error")
        return jsonify({
            "success": False,
            "message": "Unable to retrieve blood requests"
        }), 500

    finally:
        connection.close()
@app.route("/api/patient-readings", methods=["POST"])
def add_patient_reading():
    data = request.get_json()

    required_fields = ["patient_name", "heart_rate", "temperature", "spo2"]

    if not data or any(field not in data for field in required_fields):
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    try:
        heart_rate = float(data["heart_rate"])
        temperature = float(data["temperature"])
        spo2 = float(data["spo2"])

        if not (30 <= heart_rate <= 250 and 30 <= temperature <= 45 and 0 <= spo2 <= 100):
            return jsonify({
                "success": False,
                "message": "Invalid patient readings"
            }), 400

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Patient readings must be numbers"
        }), 400

    alert_status = "Normal"

    if heart_rate < 60 or heart_rate > 100 or temperature > 37.5 or spo2 < 95:
        alert_status = "Abnormal"

    connection = get_db_connection()

    try:
        cursor = connection.execute("""
            INSERT INTO patient_readings
            (patient_name, heart_rate, temperature, spo2, alert_status)
            VALUES (?, ?, ?, ?, ?)
        """, (
            str(data["patient_name"]).strip(),
            heart_rate,
            temperature,
            spo2,
            alert_status
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Patient reading saved successfully",
            "reading_id": cursor.lastrowid,
            "alert_status": alert_status
        }), 201

    except Exception:
        app.logger.exception("Patient reading error")
        return jsonify({
            "success": False,
            "message": "Unable to save patient reading"
        }), 500

    finally:
        connection.close()
@app.route("/api/patient-readings", methods=["GET"])
def get_patient_readings():
    connection = get_db_connection()

    try:
        readings = connection.execute("""
            SELECT * FROM patient_readings
            ORDER BY recorded_at DESC
        """).fetchall()

        return jsonify({
            "success": True,
            "total_readings": len(readings),
            "readings": [dict(item) for item in readings]
        }), 200

    except Exception:
        app.logger.exception("Patient readings retrieval error")
        return jsonify({
            "success": False,
            "message": "Unable to retrieve patient readings"
        }), 500

    finally:
        connection.close()
@app.route("/api/appointments", methods=["POST"])
def book_appointment():
    data = request.get_json()

    required_fields = [
        "patient_name",
        "phone",
        "department",
        "appointment_date"
    ]

    if not data or any(not data.get(field) for field in required_fields):
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    connection = get_db_connection()

    try:
        department = str(data["department"]).strip()
        appointment_date = str(data["appointment_date"]).strip()

        result = connection.execute("""
            SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token
            FROM appointments
            WHERE department = ? AND appointment_date = ?
        """, (department, appointment_date)).fetchone()

        token_number = result["next_token"]
        estimated_wait = (token_number - 1) * 15

        cursor = connection.execute("""
            INSERT INTO appointments
            (patient_name, phone, department, appointment_date,
             token_number, estimated_wait_minutes)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            str(data["patient_name"]).strip(),
            str(data["phone"]).strip(),
            department,
            appointment_date,
            token_number,
            estimated_wait
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Appointment booked successfully",
            "appointment_id": cursor.lastrowid,
            "token_number": token_number,
            "estimated_wait_minutes": estimated_wait
        }), 201

    except Exception:
        app.logger.exception("Appointment booking error")
        return jsonify({
            "success": False,
            "message": "Unable to book appointment"
        }), 500

    finally:
        connection.close()
@app.route("/api/appointments", methods=["GET"])
def get_appointments():
    connection = get_db_connection()

    try:
        appointments = connection.execute("""
            SELECT * FROM appointments
            ORDER BY appointment_date DESC, token_number ASC
        """).fetchall()

        return jsonify({
            "success": True,
            "total_appointments": len(appointments),
            "appointments": [dict(item) for item in appointments]
        }), 200

    except Exception:
        app.logger.exception("Appointment retrieval error")
        return jsonify({
            "success": False,
            "message": "Unable to retrieve appointments"
        }), 500

    finally:
        connection.close()
# ---------------------------------
# RUN FLASK APPLICATION
# ---------------------------------


if __name__ == "__main__":
    app.run(debug=True, port=5000)
