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

def search_applications(args):
    print("search applications")
    sql_query = "SELECT * FROM Application"
    q = args.get('q')
    if q is not None:
        sql_query += f' WHERE user_id LIKE "%{q}%" OR posting_id LIKE "%{q}%" OR status LIKE "%{q}%" OR portal LIKE "%{q}%"'
    try:
        page = int(args.get('page'))
    except:
        page = 1
    try:
        per_page = int(args.get('per_page'))
    except:
        per_page = 25
    sql_query += f' LIMIT {per_page} OFFSET {(page - 1) * per_page}'
    conn = db.connect()
    results = conn.execute(sql_query).fetchall()
    print(results)
    conn.close()
    return [dict(zip(["id", "user_id", "posting_id", "status", "portal"], result)) for result in results]
    # return get_all('Application', ["id", "user_id", "posting_id", "status", "portal"], page, per_page)

def create_application(data):
    conn = db.connect()
    result = conn.execute(f'INSERT INTO Application(user_id, posting_id, status, portal) VALUES({data["user_id"]}, {data["posting_id"]}, {data["status"]}, {data["portal"]})')
    conn.close()

def delete_application(id):
    conn = db.connect()
    result = conn.execute(f'DELETE FROM Application WHERE id={id}')
    conn.close()

def update_application(data):
    conn = db.connect()
    result = conn.execute(f'UPDATE Application SET user_id={data["user_id"]}, posting_id={data["posting_id"]}, status={data["status"]}, portal={data["portal"]}')
    conn.close()

