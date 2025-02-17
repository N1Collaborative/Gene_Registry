from flask import Flask, jsonify, request, render_template
import pandas as pd
import os

app = Flask(__name__)

# Load Excel file
FILE_PATH = "data.xlsx"
def load_data():
    if os.path.exists(FILE_PATH):
        df = pd.read_excel(FILE_PATH)
        return df.to_dict(orient='records')
    return []

data = load_data()

# API endpoint for searching
@app.route('/api/search')
def search():
    query = request.args.get('q', '').lower()
    results = [row for row in data if query in str(row).lower()]
    return jsonify(results)


# API endpoint for fetching an entry by ID
@app.route('/api/entry/<int:entry_id>')
def entry(entry_id):
    if 0 <= entry_id < len(data):
        return jsonify(data[entry_id])
    return jsonify({"error": "Entry not found"}), 404

# Serve static HTML for GitHub Pages compatibility
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/entry.html')
def entry_page():
    return render_template('entry.html')

if __name__ == '__main__':
    app.run(debug=True)
