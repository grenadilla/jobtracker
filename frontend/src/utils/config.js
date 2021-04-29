let baseUrl = "http://127.0.0.1:5000";
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://jobtracker-flask-app-h736v23jdq-uc.a.run.app/';
}

export { baseUrl };
