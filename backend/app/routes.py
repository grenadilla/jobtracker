from flask import request, jsonify
from app import app
from app import database
from math import ceil

@app.route("/")
def homepage():
    return "Hello World!"

@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    query_result = database.fetch_user(user_id)
    return jsonify(query_result[0])

def get_all(query_func):
    try:
        page = int(request.args.get('page'))
    except:
        page = 1
    try:
        per_page = int(request.args.get('per_page'))
    except:
        per_page = 25
    query_result, total = query_func(page, per_page)
    return jsonify({"payload": query_result, "total_pages": ceil(total / per_page), "current_page": page, "per_page": per_page})


@app.route('/company/all', methods=["GET"])
def get_companies():
    return get_all(database.all_companies)

@app.route('/posting/all', methods=["GET"])
def get_postingss():
    return get_all(database.all_postings)

@app.route('/application/search', methods=["GET"])
def search_applications():
    print("route search applications")
    result = database.search_applications(request.args)
    return jsonify(result)
    # return get_all(database.all_applications)

@app.route('/application', methods=["POST"])
def create_application():
    database.create_application(request.json)
    return jsonify({"success": True})

@app.route('/application', methods=["PUT"])
def update_application():
    database.update_application(request.json)
    return jsonify({"success": True})

@app.route('/application/<int:id>', methods=["DELETE"])
def delete_application(id):
    database.delete_application(id)
    return jsonify({"success": True})
