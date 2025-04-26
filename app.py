from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

# Load each Excel file separately
n1c_projects = pd.read_excel('N1C_projects.xlsx')  # <-- Your first file
marketed_drugs = pd.read_excel('Marketed_drugs.xlsx')  # <-- Your second file

@app.route('/api/N1C_projects')
def get_n1c_projects():
    data = n1c_projects.fillna("").to_dict(orient="records")
    return jsonify(data)

@app.route('/api/marketed_drugs')
def get_marketed_drugs():
    data = marketed_drugs.fillna("").to_dict(orient="records")
    return jsonify(data)

@app.route('/')
def home():
    return "Gene Registry Backend is Running!"

if __name__ == '__main__':
    app.run(debug=True)
