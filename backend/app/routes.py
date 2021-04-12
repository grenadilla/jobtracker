from flask import request, jsonify
from app import app
from app import database
from math import ceil

@app.route("/")
def homepage():
    return "Hello World!"

@app.route('/user/all', methods=["GET"])
def get_users():
    search = request.args.get('search')
    return get_all(database.all_users, search)

@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    query_result = database.fetch_user(user_id)
    return jsonify(query_result)

@app.route('/user/edit', methods=["POST"])
def update_user():
    database.edit_user(request.get_json())
    return "SUCCESS"

@app.route('/user/create', methods=["POST"])
def create_user():
    database.create_user(request.get_json())
    return "SUCCESS"

@app.route('/user/delete', methods=["POST"])
def delete_user():
    database.delete_user(request.get_json()["id"])
    return "SUCCESS"

def get_all(query_func, search = None):
    try:
        page = int(request.args.get('page'))
    except:
        page = 1
    try:
        per_page = int(request.args.get('per_page'))
    except:
        per_page = 25
    query_result, total = query_func(page, per_page, search)
    return jsonify({"payload": query_result, "total_pages": ceil(total / per_page), "current_page": page, "per_page": per_page})



@app.route('/company/all', methods=["GET"])
def get_companies():
    search = request.args.get('search')
    return get_all(database.all_companies, search)

@app.route('/company/<int:company_id>', methods=["GET"])
def get_company(company_id):
    query_result = database.fetch_company(company_id)
    return jsonify(query_result)

@app.route('/company/edit', methods=["POST"])
def update_company():
    database.edit_company(request.get_json())
    return "SUCCESS"

@app.route('/company/create', methods=["POST"])
def create_company():
    database.create_company(request.get_json())
    return "SUCCESS"

@app.route('/company/delete', methods=["POST"])
def delete_company():
    database.delete_company(request.get_json()["id"])
    return "SUCCESS"

@app.route('/posting/all', methods=["GET"])
def get_postingss():
    return get_all(database.all_postings)

@app.route('/posting/<int:posting_id>', methods=["GET"])
def get_posting(posting_id):
    query_result = database.fetch_posting(posting_id)
    return jsonify(query_result)

@app.route('/posting/create', methods=["POST"])
def create_posting():
    database.create_posting(request.get_json())
    return "SUCCESS"

@app.route('/posting/edit', methods=["POST"])
def update_posting():
    database.edit_posting(request.get_json())
    return "SUCCESS"

@app.route('/posting/delete', methods=["POST"])
def delete_posting():
    database.delete_posting(request.get_json()["id"])
    return "SUCCESS"

