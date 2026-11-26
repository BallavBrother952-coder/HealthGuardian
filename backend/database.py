
import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parent / "healthguardian.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    connection = get_db_connection()

    # Users table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Blood donors table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS donors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            blood_group TEXT NOT NULL,
            city TEXT NOT NULL,
            available INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Emergency blood requests table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS blood_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            blood_group TEXT NOT NULL,
            units INTEGER NOT NULL,
            hospital TEXT NOT NULL,
            city TEXT NOT NULL,
            contact TEXT NOT NULL,
            urgency TEXT DEFAULT 'Normal',
            status TEXT DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Patient monitoring table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS patient_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            heart_rate REAL NOT NULL,
            temperature REAL NOT NULL,
            spo2 REAL NOT NULL,
            alert_status TEXT DEFAULT 'Normal',
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Hospital appointments and queue table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            department TEXT NOT NULL,
            appointment_date TEXT NOT NULL,
            token_number INTEGER NOT NULL,
            status TEXT DEFAULT 'Waiting',
            estimated_wait_minutes INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(department, appointment_date, token_number)
        )
    """)

    connection.commit()
    connection.close()

    print("All Health Guardian database tables created successfully!")


if __name__ == "__main__":
    initialize_database()
