from app import db
from sqlalchemy import select
import uuid
import hashlib
import datetime

def get_user_id_from_email(email):
    conn = db.connect()
    query_result = conn.execute(f'SELECT id FROM User WHERE username = "{email}"').fetchone()
    conn.close()
    return query_result[0]

def fetch_user(user_id):
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM User WHERE id = {user_id};').fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["id", "username", "password", "name", "grade", "gpa"], query_result))

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

def company_ids(search):
    if search is None:
        search = ''
    conn = db.connect()
    query_results = conn.execute(f'SELECT name, id FROM Company WHERE name LIKE "%%{search}%%"').fetchall()
    conn.close()
    return [{"value": entry[1], "label": entry[0]} for entry in query_results]

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

def all_postings_companies():
    conn = db.connect()
    query_results = conn.execute(f"""
        SELECT Posting.id, title, description, location, link, due_date, name AS company, posted_by
        FROM Posting JOIN (SELECT id, name FROM Company) as C ON Posting.posted_by = C.id
    """).fetchall()
    conn.close()
    return [dict(zip(["id", "title", "description", "location", "link", "due_date", "company", "posted_by"], result)) for result in query_results]

def fetch_posting(posting_id):
    conn = db.connect()
    query_result = conn.execute(f"""SELECT Posting.id, title, description, location, link, due_date, name AS company, posted_by
        FROM Posting JOIN (SELECT id, name FROM Company) as C ON Posting.posted_by = C.id 
        WHERE Posting.id = {posting_id}""").fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["id", "title", "description", "location", "link", "due_date", "company", "posted_by"], query_result))

def edit_posting(data):
    print(data)
    conn = db.connect()
    query = f"""
    UPDATE Posting
    SET title = "{data["title"]}", description = "{data["description"]}",
    location = "{data["location"]}", link = "{data["link"]}",
    due_date = "{data["due_date"]}", posted_by = {data["posted_by"]}
    WHERE id = {data["id"]};
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

  query = f'INSERT INTO User (username, hashed_password, name, grade, gpa) VALUES("{data["username"]}", "{data["password"]}", "{data["name"]}", "{data["grade"]}", "{data["gpa"]}");'
  conn.execute(query)
  query_results = conn.execute("SELECT LAST_INSERT_ID();")
  query_results = [x for x in query_results]
  user_id = query_results[0][0]
  conn.close()

  return user_id

def edit_user(user_id, data) -> None:
	conn = db.connect()
	query = f'UPDATE User SET name = "{data["name"]}", grade = "{data["grade"]}", gpa = "{data["gpa"]}" WHERE id = {user_id};'
	conn.execute(query)
	conn.close()

def delete_user(id) -> None:
	conn = db.connect()
	query = f'DELETE FROM User WHERE id={id};'
	conn.execute(query)
	conn.close()

def does_user_exist(username):
    conn = db.connect()
    query = f'SELECT count(*) FROM User WHERE username="{username}";'
    num_results = conn.execute(query).scalar()
    return num_results > 0

def create_posting(data):
    conn = db.connect()
    conn.execute(f'INSERT INTO Posting (title, description, location, link, due_date, posted_by) VALUES ("{data["title"]}", "{data["description"]}", "{data["location"]}", "{data["link"]}", "{data["due_date"]}", "{data["posted_by"]}")')
    conn.close()

def delete_posting(id):
    conn = db.connect()
    conn.execute(f'DELETE FROM Posting WHERE id = {id}')
    conn.close()

def all_applications(page, per_page, search = None):
    return get_all('Application', ["id", "user_id", "posting_id", "status", "portal"], page, per_page, search_attribute="status", search=search)

def fetch_application(application_id):
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM Application WHERE id = {application_id};').fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["id", "user_id", "posting_id", "status", "portal"], query_result))

def apply(username, data):
    conn = db.connect()
    user_id = conn.execute(f'SELECT id FROM User WHERE username = "{username}"').fetchone()[0]
    conn.execute(f"""
        INSERT INTO Application (user_id, posting_id, status, portal)
        VALUES ("{user_id}", "{data["posting_id"]}", "{data["status"]}", "{data["portal"]}")
    """)
    conn.close()

def create_application(data):
    conn = db.connect()
    conn.execute(f'INSERT INTO Application (user_id, posting_id, status, portal) VALUES ("{data["user_id"]}", "{data["posting_id"]}", "{data["status"]}", "{data["portal"]}")')
    conn.close()

def edit_application(data):
    conn = db.connect()
    conn.execute(f'UPDATE Application SET status = "{data["status"]}", portal = "{data["portal"]}" WHERE id = {data["id"]}')
    conn.close()

def delete_application(id):
    conn = db.connect()
    conn.execute(f'DELETE FROM Application WHERE id = {id}')
    conn.close()

def all_skills():
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM Skill')
    conn.close()
    if query_result is None:
        return []
    return [dict(zip(["id", "name"], result)) for result in query_result]

def fetch_skill(skill_id):
    conn = db.connect()
    query_result = conn.execute(f'SELECT * FROM Skill WHERE id = {skill_id}').fetchone()
    conn.close()
    if query_result is None:
        return None
    return dict(zip(["id", "name"], query_result))

def fetch_skills_by_posting_id(posting_id):
    conn = db.connect()
    query = f'''
    SELECT DISTINCT s.id, s.name
    FROM Skill s
    JOIN Posting p
    JOIN Skill_Requirement sr
    WHERE s.id = sr.skill_id AND sr.posting_id = {posting_id}
    '''
    query_results = conn.execute(query).fetchall()
    conn.close()
    if query_results is None:
        return None
    attributes = ["id", "name"]
    return [dict(zip(attributes, result)) for result in query_results]

def edit_skill(data):
    conn = db.connect()
    conn.execute(f'UPDATE Skill SET name = "{data["name"]}" WHERE id = {data["id"]}')
    conn.close()

def create_skill(data):
    conn = db.connect()
    conn.execute(f'INSERT INTO Skill (name) VALUES ("{data["name"]}")')
    conn.close()

def delete_skill(id):
    conn = db.connect()
    conn.execute(f'DELETE FROM Skill WHERE id = {id}')
    conn.close()

def add_user_skills(user_id, skill_ids):
    rows = [f'({user_id}, {skill_id})' for skill_id in skill_ids]
    conn = db.connect()
    conn.execute(f'INSERT INTO User_Skill(user_id, skill_id) VALUES {", ".join(rows)}')
    conn.close()

def get_user_skills(user_id):
    conn = db.connect()
    results = conn.execute(f'SELECT skill_id from User_Skill WHERE user_id={user_id}')
    conn.close()
    return [result[0] for result in results]

def remove_all_user_skills(user_id):
    conn = db.connect()
    conn.execute(f'DELETE FROM User_Skill WHERE user_id={user_id}')
    conn.close()

def fetch_applications(username):
    conn = db.connect()
    user_id = conn.execute(f'SELECT id FROM User WHERE username = "{username}"').fetchone()[0]
    query = f'''SELECT
    corp.name, a.id, corp.website, p.title, p.description, p.link, p.location, a.portal, a.status
    FROM Company corp 
    JOIN Posting p ON corp.Id = p.posted_by 
    JOIN Application a ON p.Id = a.posting_id 
    WHERE a.user_id = {user_id}
    '''
    query_results = conn.execute(query).fetchall()
    conn.close()    
    if query_results is None:
        return None
    attributes = ['company', 'application_id', 'website', 'title', 'description', 'link', 'location', 'portal', 'status']
    #for row in query_results:
    #    date = row['due_date']
    #    date.strftime('%m/%d/%Y')
    return [dict(zip(attributes, result)) for result in query_results]

def all_application_tasks(username = None, application_id = None):
    conn = db.connect()
    filter = ""
    if username is not None:
        user_id = conn.execute(f'SELECT id FROM User WHERE username = "{username}"').fetchone()[0]
        filter = f"WHERE a.user_id = {user_id}"
    elif application_id is not None:
        filter = f"WHERE a.id = {application_id}"
    query = f'''SELECT corp.name, p.title, task.due_date, task.name, task.position, task.completed, a.id
    FROM Company corp JOIN Posting p 
    ON corp.Id = p.posted_by 
    JOIN Application a ON p.Id = a.posting_id 
    JOIN Application_Task task ON a.Id = task.application_id
    {filter}'''
    query_results = conn.execute(query).fetchall()

    conn.close()
    if query_results is None:
        return None
    
    results = []
    for row in query_results:
        company_name, title, date, task, position, completed, application_id = row
        
        date = date.strftime('%m/%d/%Y')
        completed = completed == 1
        
        result = tuple((company_name, title, date, task, position, completed, application_id))
        results.append(result)
    
    attributes = ['company', 'title', 'due_date', 'name', 'position', 'completed', 'application_id']
    return [dict(zip(attributes, result)) for result in results]

def create_task(data):
    conn = db.connect()
    position = conn.execute(f'SELECT MAX(position) FROM Application_Task WHERE application_id = {data["application_id"]}').fetchone()[0]
    if position is not None:
        position += 1
    else:
        position = 1
    conn.execute(f"""
        INSERT INTO Application_Task
        (position, application_id, name, due_date, completed) 
        VALUES ({position}, {data["application_id"]}, "{data["name"]}", "{data["due_date"]}", {data["completed"]})
    """)
    conn.close()

def edit_task(data):
    conn = db.connect()
    date = datetime.datetime.strptime(data['due_date'], "%m/%d/%Y")
    completed = int(data["completed"])
    conn.execute(f'UPDATE Application_Task SET name = "{data["name"]}", due_date = "{date.strftime("%Y-%m-%d")}", completed = {completed} WHERE application_id = {data["application_id"]} AND position = {data["position"]}')
    conn.close()

def delete_task(application_id, position):
    conn = db.connect()
    num_tasks = conn.execute(f'SELECT MAX(position) FROM Application_Task WHERE application_id = {application_id}').fetchone()[0]
    conn.execute(f'DELETE FROM Application_Task WHERE application_id = {application_id} AND position = {position}')

    # decrement the position of all succeeding application tasks
    for i in range(position + 1, num_tasks + 1):
        conn.execute(f'UPDATE Application_Task SET position={i - 1} WHERE application_id = {application_id} AND position = {i}')

    conn.close()

def worked_for(company_id):
    conn = db.connect()
    query_results = conn.execute(f"""SELECT User.name 
        FROM Company JOIN Worked_For ON Company.id = Worked_For.company_id
        JOIN User ON Worked_For.user_id = User.id
        WHERE Company.id = {company_id}
    """).fetchall()
    conn.close()
    return [name[0] for name in query_results]