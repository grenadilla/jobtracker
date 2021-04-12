from app import db
from sqlalchemy import select

def fetch_user(user_id):
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM User WHERE id = {user_id};').fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["id", "username", "password", "name", "grade", "GPA"], query_result))

def get_all(table, attributes, page, per_page, search_attribute = None, search = None):
    conn = db.connect()
    if search_attribute is not None and search is not None:
        search_query = f'WHERE {search_attribute} LIKE "%%{search}%%"'
    else:
        search_query = ""
    query_results = conn.execute(f'SELECT * FROM {table} {search_query} LIMIT {per_page} OFFSET {(page - 1) * per_page}')
    total = conn.execute(f'SELECT COUNT(*) FROM {table} {search_query}').fetchone()[0]
    conn.close()
    return [dict(zip(attributes, result)) for result in query_results], total

def all_companies(page, per_page, search = None):
    return get_all('Company', ["id", "name", "website", "description"], page, per_page, search_attribute="name", search=search)

def fetch_company(company_id):
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM Company WHERE id = {company_id}').fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["id", "name", "website", "description"], query_result))

def edit_company(data):
    conn = db.connect()
    conn.execute(f'UPDATE Company SET name = "{data["name"]}", description = "{data["description"]}" WHERE id = {data["id"]}')
    conn.close()

def create_company(data):
    conn = db.connect()
    conn.execute(f'INSERT INTO Company (name, website, description) VALUES ("{data["name"]}", "{data["website"]}", "{data["description"]}")')
    conn.close()

def delete_company(id):
    conn = db.connect()
    conn.execute(f'DELETE FROM Company WHERE id = {id}')
    conn.close()

def all_postings(page, per_page, search = None):
    return get_all('Posting', ["id", "title", "description", "location", "link", "due_date", "posted_by"], 
        page, 
        per_page,
        search_attribute="title", search=search)

def fetch_posting(posting_id):
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM Posting WHERE id = {posting_id}').fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["id", "title", "description", "location", "link", "due_date", "posted_by"], query_result))

def edit_posting(data):
    conn = db.connect()
    query = f"""
    'UPDATE Posting 
    SET title = "{data["title"]}", description = "{data["description"]}",
    location = "{data["location"]}", link = "{data["link"]}",
    due_date = "{data["due_date"]}", posted_by = {data["posted_by"]}
    WHERE id = {data["id"]}'
    """
    conn.execute(query)
    conn.close()

def create_posting(data):
    conn = db.connect()
    query = f"""
    INSERT INTO Posting (title, description, location, link, due_date, posted_by) 
    VALUES ("{data["title"]}", "{data["description"]}", "{data["location"]}",
    "{data["link"]}", "{data["due_date"]}", {data["posted_by"]})
    """
    conn.execute(query)
    conn.close()

def delete_posting(id):
    conn = db.connect()
    conn.execute(f'DELETE FROM Posting WHERE id = {id}')
    conn.close()

def most_applicants():
    query = """
    SELECT Posting.id, name, title, COUNT(Application.id) AS num
    FROM Application JOIN Posting ON Application.posting_id = Posting.id JOIN Company ON Posting.posted_by = Company.id 
    WHERE status = "APPLIED"
    GROUP BY Posting.id
    ORDER BY num DESC;
    """
    conn = db.connect()
    query_results = conn.execute(query).fetchall()
    conn.close()
    return [dict(zip(["id", "name", "title", "num"], result)) for result in query_results]
 

def all_users(page, per_page, search = None):
    return get_all('User', ["id", "username", "password", "name", "grade", "gpa"], page, per_page, search_attribute="username", search=search)

def create_user(data) -> int:
  conn = db.connect()

  # code derived from
  # https://stackoverflow.com/questions/9594125/salt-and-hash-a-password-in-python
  salt = uuid.uuid4().hex
  hashed_password = hashlib.sha512(password + salt).hexdigest()

  query = f'INSERT INTO User (username, password, name, grade, gpa) VALUES("{data["username"]}", "{data["password"]}", "{data["name"]}", "{data["grade"]}", "{data["gpa"]}");'
  conn.execute(query)
  query_results = conn.execute("SELECT LAST_INSERT_ID();")
  query_results = [x for x in query_results]
  user_id = query_results[0][0]
  conn.close()

  return user_id

def edit_user(data) -> None:
	conn = db.connect()
	query = f'UPDATE User SET grade = "{data["grade"]}" WHERE id = {data["user_id"]};'
	conn.execute(query)
	conn.close()

def delete_user(id) -> None:
	conn = db.connect()
	query = 'DELETE FROM User WHERE id={};'.format(id)
	conn.execute(query)
	conn.close()

def all_applications(page, per_page, search = None):
    return get_all('Application', ["user_id", "posting_id", "status", "portal"], page, per_page, search_attribute="status", search=search)

def fetch_application(application_id):
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM Application WHERE id = {application_id};').fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["user_id", "posting_id", "status", "portal"], query_result))

def create_application(data):
    conn = db.connect()
    conn.execute(f'INSERT INTO Application (user_id, posting_id, status, portal) VALUES ("{data["user_id"]}", "{data["posting_id"]}", "{data["status"]}", "{data["portal"]}")')
    conn.close()

def edit_application(data):
    conn = db.connect()
    conn.execute(f'UPDATE Application SET status = "{data["status"]}" WHERE id = {data["id"]}')
    conn.close()

def delete_application(id):
    conn = db.connect()
    conn.execute(f'DELETE FROM Application WHERE id = {id}')
    conn.close()

def fetch_skill(skill_id):
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM Skill WHERE id = {skill_id}').fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["id", "skill_name"], query_result))

def edit_skill(data):
    conn = db.connect()
    conn.execute(f'UPDATE Skill SET skill_name = "{data["skill_name"]}" WHERE id = {data["id"]}')
    conn.close()

def create_skill(data):
    conn = db.connect()
    conn.execute(f'INSERT INTO Skill (skill_name) VALUES ("{data["skill_name"]}")')
    conn.close()

def delete_skill(id):
    conn = db.connect()
    conn.execute(f'DELETE FROM Skill WHERE id = {id}')
    conn.close()
