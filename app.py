from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mapping table names to file paths
TABLE_FILES = {
    "N1C_projects": "N1C_projects.xlsx",
    "marketed_drugs": "Marketed_drugs.xlsx"
}

@app.route('/api/data')
def get_data():
    table = request.args.get('table')

    if not table or table not in TABLE_FILES:
        return jsonify({"error": "Invalid or missing table name."}), 400

    file_path = TABLE_FILES[table]

    try:
        df = pd.read_excel(file_path)
        df = df.fillna("")  # Replace NaNs with empty strings
        data = df.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/search')
def search_data():
    table = request.args.get('table')
    query = request.args.get('q', '').lower()

    if not table or table not in TABLE_FILES:
        return jsonify({"error": "Invalid or missing table name."}), 400

    try:
        df = pd.read_excel(TABLE_FILES[table])
        df = df.fillna("")
        filtered = df[df.apply(lambda row: row.astype(str).str.lower().str.contains(query).any(), axis=1)]
        return jsonify(filtered.to_dict(orient='records'))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
