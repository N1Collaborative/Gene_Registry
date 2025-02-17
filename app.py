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
