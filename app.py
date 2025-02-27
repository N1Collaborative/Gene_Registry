from flask import Flask, jsonify, request
from flask_cors import CORS  # ✅ Import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# Load Excel file
FILE_PATH = "data.xlsx"
def load_data():
    if os.path.exists(FILE_PATH):
        df = pd.read_excel(FILE_PATH)
        df = df.fillna("")  # Replace NaN with empty strings

        # ✅ Remove extra spaces in column names
        df.columns = df.columns.str.strip()

        # ✅ Print cleaned column names in logs to verify
        print("Cleaned Column Names:", df.columns.tolist())

        # ✅ Force sorting by "Gene" (case insensitive)
        if "Gene" in df.columns:
            df = df.sort_values(by="Gene", key=lambda col: col.str.lower(), ascending=True)
        else:
            print("⚠️ Warning: 'Gene' column not found!")

        return df.to_dict(orient='records')
    return []


data = load_data()

@app.route('/api/data')
def get_data():
    return jsonify(data)  # Returns the full Excel table as JSON

# API endpoint for searching
@app.route('/api/search')
def search():
    query = request.args.get('q', '').lower()
    results = [row for row in data if query in " ".join(str(v).lower() for v in row.values())]
    return jsonify(results)

# API endpoint for fetching an entry by ID
@app.route('/api/entry/<int:entry_id>')
def entry(entry_id):
    if 0 <= entry_id < len(data):
        return jsonify(data[entry_id])
    return jsonify({"error": "Entry not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
