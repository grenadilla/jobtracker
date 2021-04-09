from app import db

def fetch_user(user_id):
    conn = db.connect()
    query_results = conn.execute(f'SELECT * FROM User WHERE id = {user_id};').fetchall()
    conn.close()
    return [dict(zip(["id", "username", "password", "name", "grade", "GPA"], result)) for result in query_results]