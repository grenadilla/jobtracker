from flask import request, jsonify
from app import app
from app import database
from math import ceil
from app.authentication import requires_auth, current_user

# In order to get the currently signed in user, add the decorator `@requires_auth` before the route function
# Then, current_user['email'] will contain the email address of the signed in user
# (this email is used as the `username` in the Users table in the DB)

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
    return jsonify("SUCCESS")

@app.route('/user/create', methods=["POST"])
def create_user():
    data = request.get_json()
    if database.does_user_exist(data['username']):
        return jsonify("User already exists"), 422
    database.create_user(data)
    return jsonify("SUCCESS")

@app.route('/user/delete', methods=["POST"])
def delete_user():
    database.delete_user(request.get_json()["id"])
    return jsonify("SUCCESS")

@app.route('/user/exists', methods=["GET"])
@requires_auth
def does_user_exist():
    exists = database.does_user_exist(current_user['email'])
    return jsonify(exists)

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
    return jsonify("SUCCESS")

@app.route('/company/create', methods=["POST"])
def create_company():
    database.create_company(request.get_json())
    return jsonify("SUCCESS")

@app.route('/company/delete', methods=["POST"])
def delete_company():
    database.delete_company(request.get_json()["id"])
    return jsonify("SUCCESS")

@app.route('/company/ids', methods=["GET"])
def company_ids():
    search = request.args.get('search')
    return jsonify(database.company_ids(search))

@app.route('/posting/all', methods=["GET"])
def get_postings():
    search = request.args.get('search')
    return get_all(database.all_postings, search)

@app.route('/most_applicants', methods=["GET"])
def most_applicants():
    query_results = database.most_applicants()
    return jsonify(query_results)

@app.route('/posting/<int:posting_id>', methods=["GET"])
def get_posting(posting_id):
    query_result = database.fetch_posting(posting_id)
    return jsonify(query_result)

@app.route('/posting/create', methods=["POST"])
def create_posting():
    database.create_posting(request.get_json())
    return jsonify("SUCCESS")

@app.route('/posting/edit', methods=["POST"])
def update_posting():
    database.edit_posting(request.get_json())
    return jsonify("SUCCESS")

@app.route('/posting/delete', methods=["POST"])
def delete_posting():
    database.delete_posting(request.get_json()["id"])
    return jsonify("SUCCESS")

@app.route('/application', methods=["GET"])
#@requires_auth
def get_application_data():
    query_result = database.fetch_applications()
    return jsonify(query_result)

@app.route('/application/all', methods=["GET"])
def get_applications():
    return get_all(database.all_applications)

@app.route('/application/<int:id>', methods=["GET"])
def get_application(id):
    query_result = database.fetch_application(id)
    return jsonify(query_result)

@app.route('/application/create', methods=["POST"])
def create_application():
    database.create_application(request.get_json())
    return jsonify("SUCCESS")

@app.route('/application/edit', methods=["POST"])
def update_application():
    database.edit_application(request.get_json())
    return jsonify("SUCCESS")

@app.route('/application/delete', methods=["POST"])
def delete_application():
    database.delete_application(request.get_json()["id"])
    return jsonify("SUCCESS")

@app.route('/skill/<int:skill_id>', methods=["GET"])
def get_skill(skill_id):
    query_result = database.fetch_skill(skill_id)
    return jsonify(query_result)

@app.route('/skill/edit', methods=["POST"])
def update_skill():
    database.edit_skill(request.get_json())
    return jsonify("SUCCESS")

@app.route('/skill/create', methods=["POST"])
def create_skill():
    database.create_skill(request.get_json())
    return jsonify("SUCCESS")

@app.route('/skill/delete', methods=["POST"])
def delete_skill():
    database.delete_skill(request.get_json()["id"])
    return jsonify("SUCCESS")


@app.route('/application/tasks', methods=["GET"])
#@requires_auth
def get_application_tasks():
    query_result = database.all_application_tasks()
    return jsonify(query_result)

@app.route('/posting/apply', methods=["POST"])
@requires_auth
def apply():
    database.apply(current_user["email"], request.get_json())
    return jsonify("SUCCESS")