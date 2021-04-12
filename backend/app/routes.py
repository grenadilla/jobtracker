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
def get_postings():
    return get_all(database.all_postings)

@app.route('/most_applicants', methods=["GET"])
def most_applicants():
    query_results = database.most_applicants()
    print(query_results)
    return jsonify(query_results)