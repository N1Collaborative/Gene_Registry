from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Mapping table names to file paths (filenames must exist at repo root)
TABLE_FILES = {
    "N1C_projects": "N1C_projects.xlsx",
    "marketed_drugs": "Marketed_drugs.xlsx",
    "assessed_variants": "assessed_variants.xlsx",
}

def file_path_for(table_name: str):
    rel = TABLE_FILES.get(table_name)
    if not rel:
        return None
    return os.path.join(os.path.dirname(__file__), rel)

@app.get("/health")
def health():
    return jsonify({"ok": True})

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Mapping table names to file paths (filenames must exist at repo root)
TABLE_FILES = {
    "N1C_projects": "N1C_projects.xlsx",
    "marketed_drugs": "Marketed_drugs.xlsx",
    "assessed_variants": "assessed_variants.xlsx",
}

def file_path_for(table_name: str):
    rel = TABLE_FILES.get(table_name)
    if not rel:
        return None
    return os.path.join(os.path.dirname(__file__), rel)

@app.get("/health")
def health():
    return jsonify({"ok": True})

@app.get("/api/data")
def api_data():
    table = request.args.get("table")
    path = file_path_for(table)
    if not path or not os.path.exists(path):
        return jsonify({"error": "Unknown table or file not found", "table": table, "path": path}), 404
    try:
        df = pd.read_excel(path, engine="openpyxl")
        # Debug so we can see counts in Render logs
        print(f"[DEBUG] table={table} path={path} rows={len(df)} cols={list(df.columns)}")
        data = df.fillna("").to_dict(orient="records")
        return jsonify(data)
    except Exception as e:
        print(f"[ERROR] reading {path}: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))



