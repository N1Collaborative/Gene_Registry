from flask import Flask, render_template, request
import pandas as pd
import os

app = Flask(__name__)

# Load Excel file
FILE_PATH = "data.xlsx"  # Place your Excel file in the same directory
def load_data():
    if os.path.exists(FILE_PATH):
        df = pd.read_excel(FILE_PATH)
        return df.to_dict(orient='records')
    return []

data = load_data()

@app.route('/')
def index():
    query = request.args.get('q', '')
    filtered_data = [row for row in data if query.lower() in str(row).lower()]
    return render_template('index.html', data=filtered_data, query=query)

@app.route('/entry/<int:entry_id>')
def entry(entry_id):
    entry_data = data[entry_id] if 0 <= entry_id < len(data) else None
    return render_template('entry.html', entry=entry_data)

if __name__ == '__main__':
    app.run(debug=True)

# Create templates directory and add index.html and entry.html
if not os.path.exists('templates'):
    os.makedirs('templates')

with open('templates/index.html', 'w') as f:
    f.write("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Search Database</title>
    </head>
    <body>
        <h1>Search Database</h1>
        <form method="get" action="/">
            <input type="text" name="q" value="{{ query }}">
            <button type="submit">Search</button>
        </form>
        <ul>
            {% for item in data %}
                <li><a href="/entry/{{ loop.index0 }}">{{ item }}</a></li>
            {% endfor %}
        </ul>
    </body>
    </html>
    """)

with open('templates/entry.html', 'w') as f:
    f.write("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Entry Details</title>
    </head>
    <body>
        <h1>Entry Details</h1>
        {% if entry %}
            <ul>
                {% for key, value in entry.items() %}
                    <li><strong>{{ key }}:</strong> {{ value }}</li>
                {% endfor %}
            </ul>
        {% else %}
            <p>Entry not found.</p>
        {% endif %}
        <a href="/">Back to Search</a>
    </body>
    </html>
    """)
