from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Mapping table names to Excel filenames.
# These Excel files must be in the same directory as app.py.
TABLE_FILES = {
    "N1C_projects": "N1C_projects.xlsx",
    "marketed_drugs": "Marketed_drugs.xlsx",
    "assessed_variants": "assessed_variants.xlsx",
    "assessed_genes_diseases": "assessed_genes_diseases.xlsx",
}


def file_path_for(table_name: str):
    rel = TABLE_FILES.get(table_name)

    if not rel:
        return None

    return os.path.join(
        os.path.dirname(__file__),
        rel
    )


@app.get("/health")
def health():
    return jsonify({"ok": True})


@app.get("/api/data")
def api_data():

    table = request.args.get("table")

    path = file_path_for(table)

    if not path or not os.path.exists(path):

        return jsonify({
            "error": "Unknown table or file not found",
            "table": table,
            "path": path
        }), 404

    try:

        df = pd.read_excel(
            path,
            engine="openpyxl"
        )

        print(
            f"[DEBUG] table={table} "
            f"path={path} "
            f"rows={len(df)} "
            f"cols={list(df.columns)}"
        )

        data = (
            df
            .fillna("")
            .to_dict(orient="records")
        )

        return jsonify(data)

    except Exception as e:

        print(
            f"[ERROR] reading {path}: {e}"
        )

        return jsonify({
            "error": str(e)
        }), 500


@app.get("/api/search")
def api_search():

    table = request.args.get("table")

    query = (
        request.args
        .get("q", "")
        .strip()
        .lower()
    )

    path = file_path_for(table)

    if not path or not os.path.exists(path):

        return jsonify({
            "error": "Unknown table or file not found",
            "table": table,
            "path": path
        }), 404

    try:

        df = (
            pd.read_excel(
                path,
                engine="openpyxl"
            )
            .fillna("")
        )

        if not query:
            return jsonify([])

        # Search across all columns.
        mask = df.astype(str).apply(
            lambda row:
                row.str
                .lower()
                .str
                .contains(
                    query,
                    regex=False
                )
                .any(),
            axis=1
        )

        results = (
            df[mask]
            .to_dict(orient="records")
        )

        return jsonify(results)

    except Exception as e:

        print(
            f"[ERROR] searching {path}: {e}"
        )

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(
            os.environ.get(
                "PORT",
                10000
            )
        )
    )
