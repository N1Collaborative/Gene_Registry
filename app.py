from flask import Flask, jsonify, request
import pandas as pd
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Mapping table names to file pathsign
TABLE_FILES = {
    "N1C_projects": "N1C_projects.xlsx",
    "marketed_drugs": "Marketed_drugs.xlsx",
    "assessed_variants": "assessed_variants.xlsx"
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
    query = request.args.get('q', '').strip()
    table = request.args.get('table')

    if not table or table not in TABLE_FILES:
        return jsonify({"error": "Invalid or missing table name."}), 400

    try:
        df = pd.read_excel(TABLE_FILES[table]).fillna("")

        # ✅ Use regex with word boundaries and case-insensitive matching
        pattern = re.compile(rf'\b{re.escape(query)}\b', re.IGNORECASE)

        def match_row(row):
            return any(pattern.search(str(value)) for value in row)

        filtered = df[df.apply(match_row, axis=1)]
        return jsonify(filtered.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
