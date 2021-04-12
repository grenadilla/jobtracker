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