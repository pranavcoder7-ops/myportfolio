from flask import Flask, request, jsonify, send_from_directory
import mysql.connector

app = Flask(__name__)


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="pranav@1234",
        database="portfolio_db"
    )


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/<path:filename>")
def files(filename):
    return send_from_directory(".", filename)


@app.route("/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        if not name or not email or not message:
            return jsonify({
                "success": False,
                "message": "All fields are required."
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO contact_messages (name, email, message)
            VALUES (%s, %s, %s)
        """

        cursor.execute(query, (name, email, message))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Message saved successfully!"
        })

    except Exception as e:
        print("Database error:", e)

        return jsonify({
            "success": False,
            "message": "Database error occurred."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)