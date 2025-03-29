from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import pandas as pd
import os
import json

app = Flask(__name__)
CORS(app)

# Load Excel and convert to JSON once
FILE_PATH = "data.xlsx"
data = []
json_data = "[]"

if os.path.exists(FILE_PATH):
    df = pd.read_excel(FILE_PATH)
    df.columns = df.columns.str.strip()  # Strip whitespace from column headers
    df = df.fillna("")  # ✅ Replace NaN with empty strings
    if "Gene" in df.columns:
        df = df.sort_values(by="Gene", key=lambda col: col.str.lower() if col.dtype == "object" else col)
    data = df.to_dict(orient="records")
    json_data = json.dumps(data)  # ✅ Now it's safe — no NaN


@app.route('/api/data')
def get_data():
    return app.response_class(
        response=json_data,
        status=200,
        mimetype='application/json'
    )

@app.route('/api/search')
def search():
    query = request.args.get('q', '').lower()
    results = [row for row in data if query in " ".join(str(v).lower() for v in row.values())]
    return jsonify(results)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/entry.html')
def entry_page():
    return render_template('entry.html')

if __name__ == '__main__':
    app.run(debug=True)
