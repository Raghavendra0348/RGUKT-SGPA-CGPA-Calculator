from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
import os

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cgpa_calculator.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Configure email for verification (use your email settings)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'  # Replace with your actual email
app.config['MAIL_PASSWORD'] = 'your_password'  # Replace with your actual password
mail = Mail(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    semester = db.Column(db.String(50), nullable=False)
    sgpa = db.Column(db.Float, nullable=False)
    cgpa = db.Column(db.Float, nullable=False)

# Routes
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('signup.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = generate_password_hash(request.form['password'], method='pbkdf2:sha256')  # Corrected method
        
        if '@rgukt.ac.in' not in email:
            return "Only RGUKT email addresses are allowed!", 400
        
        new_user = User(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('login'))
    
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            return redirect(url_for('dashboard'))
        
        return "Invalid email or password!", 400
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Clear session
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    results = Result.query.filter_by(user_id=user_id).all()
    return render_template('dashboard.html', results=results)

@app.route('/add_result', methods=['POST'])
def add_result():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    semester = request.form['semester']
    sgpa = float(request.form['sgpa'])
    cgpa = float(request.form['cgpa'])
    
    new_result = Result(user_id=user_id, semester=semester, sgpa=sgpa, cgpa=cgpa)
    db.session.add(new_result)
    db.session.commit()

    # Send results to email after submitting
    user = User.query.get(user_id)
    send_results_to_email(user.email, semester, sgpa, cgpa)

    return redirect(url_for('dashboard'))  # Redirect to dashboard after saving results

def send_results_to_email(email, semester, sgpa, cgpa):
    subject = f"Your Results for Semester {semester}"
    body = f"Your SGPA for semester {semester} is {sgpa}\nYour CGPA is {cgpa}"

    msg = Message(subject, recipients=[email])
    msg.body = body
    try:
        mail.send(msg)  # Send the email
    except Exception as e:
        print(f"Error sending email: {e}")  # Handle email errors gracefully

# Ensure the database is created when the app starts
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # This will create the database tables
    app.run(debug=True)
