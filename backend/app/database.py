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

def all_postings(page, per_page):
    return get_all('Posting', ["id", "title", "description", "location", "link", "due_date", "posted_by"], page, per_page)


def create_user(data) -> int:
  conn = db.connect()

  # code derived from
  # https://stackoverflow.com/questions/9594125/salt-and-hash-a-password-in-python
  salt = uuid.uuid4().hex
  hashed_password = hashlib.sha512(password + salt).hexdigest()

  query = 'INSERT INTO User (username, password, name, grade, gpa) VALUES("{data["username"]}", "{data["password"]}", "{data["name"]}", "{data["grade"]}", "{data["gpa"]}");'
  conn.execute(query)
  query_results = conn.execute("SELECT LAST_INSERT_ID();")
  query_results = [x for x in query_results]
  user_id = query_results[0][0]
  conn.close()

  return user_id

def edit_user(data) -> None:
	conn = db.connect()
	query = 'UPDATE User SET grade = "{data["grade"]}" WHERE id = {data["user_id"]};'
	conn.execute(query)
	conn.close()

def delete_user(id) -> None:
	conn = db.connect()
	query = 'DELETE FROM User WHERE id={};'.format(id)
	conn.execute(query)
	conn.close()

def create_posting(data):
    conn = db.connect()
    conn.execute(f'INSERT INTO Posting (title, description, location, link, due_date, posted_by) VALUES ("{data["title"]}", "{data["description"]}", "{data["location"]}", "{data["link"]}", "{data["due_date"]}", "{data["posted_by"]}")')
    conn.close()

def edit_posting(data):
    conn = db.connect()
    conn.execute(f'UPDATE Posting SET title = "{data["title"]}", description = "{data["description"]}" WHERE id = {data["id"]}')
    conn.close()

def delete_posting(id):
    conn = db.connect()
    conn.execute(f'DELETE FROM Posting WHERE id = {id}')
    conn.close()

