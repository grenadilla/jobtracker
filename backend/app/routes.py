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
    return jsonify(query_result)

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

@app.route('/company/<int:company_id>', methods=["GET"])
def get_company(company_id):
    query_result = database.fetch_company(company_id)
    return jsonify(query_result)

@app.route('/company/edit', methods=["POST"])
def update_company():
    database.edit_company(request.get_json())
    return "SUCCESS"

@app.route('/posting/all', methods=["GET"])
def get_postingss():
    return get_all(database.all_postings)