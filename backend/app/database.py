from app import db
from sqlalchemy import select

def fetch_user(user_id):
    conn = db.connect()
    query_results = conn.execute(f'SELECT * FROM User WHERE id = {user_id};').fetchall()
    conn.close()
    return [dict(zip(["id", "username", "password", "name", "grade", "GPA"], result)) for result in query_results]

def get_all(table, attributes, page, per_page):
    conn = db.connect()
    query_results = conn.execute(f'SELECT * FROM {table} LIMIT {per_page} OFFSET {(page - 1) * per_page}')
    total = conn.execute(f'SELECT COUNt(*) FROM {table}').fetchone()[0]
    conn.close()
    return [dict(zip(attributes, result)) for result in query_results], total

def all_companies(page, per_page):
    return get_all('Company', ["id", "name", "website", "description"], page, per_page)

def all_postings(page, per_page):
    return get_all('Posting', ["id", "title", "description", "location", "link", "due_date", "posted_by"], page, per_page)