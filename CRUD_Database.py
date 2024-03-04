from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

import os
connection_string = os.environ.get('DB_CONNECTION_STRING')
# Connect to MongoDB Atlas
client = MongoClient(connection_string)
db = client["List"]
collection = db["Tasks"]

# Show all tasks
@app.route("/tasks", methods=["GET"])
def show_all_tasks():
    tasks = list(collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])  # Convert ObjectId to string
    return make_response(jsonify(tasks), 200)

#Show a task
@app.route("/tasks/<string:id>", methods=["GET"])
def read_task(id):
    document = collection.find_one({"_id": ObjectId(id)})
    if document:
        # Convert ObjectId to string
        document["_id"] = str(document["_id"])
        return make_response(jsonify(document), 200)
    else:
        return make_response(jsonify({"error": "Document not found"}), 404)

# Create a task
@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.json
    task = {
        "Description": data.get("Description"),
        "Hidden": data.get("Hidden"),
        "Notes": data.get("Notes"),
        "Status": data.get("Status")
    }
    result = collection.insert_one(task)
    task["_id"] = str(result.inserted_id)  # Convert ObjectId to string
    return make_response(jsonify(task), 201)

# Update a task
@app.route("/tasks/<string:id>", methods=["PUT"])
def update_task(id):
    data = request.json
    updated_task = {
        "$set": {
            "Description": data.get("Description"),
            "Hidden": data.get("Hidden"),
            "Notes": data.get("Notes"),
            "Status": data.get("Status")
        }
    }
    result = collection.update_one({"_id": ObjectId(id)}, updated_task)
    if result.modified_count == 1:
        return make_response(jsonify({"message": "Task updated successfully"}), 200)
    else:
        return make_response(jsonify({"error": "Task not found"}), 404)

# Delete a task
@app.route("/tasks/<string:id>", methods=["DELETE"])
def delete_task(id):
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return make_response(jsonify({"message": "Task deleted successfully"}), 200)
    else:
        return make_response(jsonify({"error": "Task not found"}), 404)

if __name__ == "__main__":
    app.run(debug=True)