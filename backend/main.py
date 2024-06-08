#!/usr/bin/python
#
# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import os
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson import ObjectId
from openai import OpenAI
from recruiter import screen_candidates, get_screening_results, call_candidate



from flask import Flask

app = Flask(__name__)
origins = ['http://localhost:3000']
cors = CORS(app, supports_credentials=True, origins=origins)
app.config["CORS_HEADERS"] = "Content-Type"

openai_client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

MONGODB_URI = os.environ.get("MONGODB_URI")
if MONGODB_URI:
    mongo_client = MongoClient(MONGODB_URI)
    print("mongo_client.list_database_names",
          mongo_client.list_database_names())
    db = mongo_client["test"]
    print("db.list_collection_names()", db.list_collection_names())
else:
    print(f"MONGODB_URI is '${MONGODB_URI}'")


@app.route("/screen", methods=["GET", "POST"])
@cross_origin()
def screen():
    user_id = request.args.get("user_id", None)

    if request.method == "POST":
        job_description = request.json.get("job_description", None)
        key_criteria = request.json.get("key_criteria", None)
        return screen_candidates(openai_client, db, user_id, job_description, key_criteria)

    return get_screening_results(openai_client, db, user_id)


@app.route("/call", methods=["GET", "POST"])
@cross_origin()
def call():

    document_id = request.args.get("document_id", None)

    if request.method == "GET":

        call_candidate(db, document_id)
        return "Call Candidate"

    phone = request.json.get("phone", None)
    query = request.json.get("query", None)

    call_candidate(db, document_id, phone, query)

    return "Call Candidate"



@app.route('/')
def hello_world():
    target = os.environ.get('TARGET', 'World')
    return 'Hello {}!\n'.format(target)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))