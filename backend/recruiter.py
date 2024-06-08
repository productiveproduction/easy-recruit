import json
from bson.objectid import ObjectId
from utils import sanitize_data
from threading import Thread
from time import sleep
import requests
import os

# Your Vapi API Authorization token
auth_token = os.getenv('VAPI_AUTH_TOKEN')
# The Phone Number ID, and the Customer details for the call
phone_number_id = os.getenv('VAPI_PHONE_NUMBER_ID')

# Create the header with Authorization token
headers = {
    'Authorization': f'Bearer {auth_token}',
    'Content-Type': 'application/json',
}


def call_candidate(db, document_id, customer_number, query):

    job = db.documents.find_one({"_id": ObjectId(document_id)})
    print(job)
    print(query)

    system = """You are a voice assistant for Easy Recruit AI, an automated recuitment platform. You will be doing the initial phone screening with the candidate.
    You are tasked with performing an initial phone screening with the candidate, the details will be given to you by the recruiter.

    Here are the questions you need to ask the candidate:
    {query}

    - Keep all your responses short and simple. Use casual language, phrases like "Umm...", "Well...", and "I mean" are preferred.
    - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.
    """.format(query=query)

    # if query is None:
    #     query = """
    #   1. Ask for their full name.
    #   2. Ask the user to outline the most imporessive work that they are proud of at their last role.
    #   3. Confirm their salary expecations.
    #   4. Finish the converation and wrapp up the call
    #   """
    # Create the data payload for the API request
    data = {
        'assistant': {
            "firstMessage": f"Hello, this is Mary from Easy Recruit AI. I'm just calling regarding the recent role you've applied at {job['company']}. I just have a few questions to ask you. Is that okay?",
            "model": {
                "provider": "openai",
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": system
                    },
                ],
            },
            "voice": "jennifer-playht"
        },
        'phoneNumberId': phone_number_id,
        'customer': {
            'number': customer_number,
        },
    }

    # Make the POST request to Vapi to create the phone call
    response = requests.post(
        'https://api.vapi.ai/call/phone', headers=headers, json=data)

    # Check if the request was successful and print the response
    if response.status_code == 201:
        print('Call created successfully')
        res = response.json()
        id = res['id']
        print(id)

        while True:
            response = requests.get(
                f'https://api.vapi.ai/call/{id}', headers=headers)
            if response.status_code == 200:
                res = response.json()
                print(res)
                if res['status'] == 'ended':
                    print('Call ended')
                    print('call transcript:', res['transcript'])

                    db.documents.find_one_and_update(
                        {"_id": ObjectId(document_id)},
                        {"$set": {
                            "status": "called", "transcript": res['transcript'], "summary": res['summary']}}
                    )

                    break
            sleep(3)

    else:
        print('Failed to create call')
        print(response.text)


system = """ You have been assigned to screen candidates for the following job: 


JOB DESCRIPTION:\"\"\"[DESCRIPTION]\"\"\"

KEY CRITERIA:\"\"\"[CRITERIA]\"\"\"



Please review the job description and key criteria and provide a brief summary of how fit you think the canditate is for the role.


please provide a JSON with a score between 1 and 10.


Here are the exact fields you need to fill in the same order:
name,
role: title of the candidate,
company: last company,
email,
phone,
reason: reason for the score,
score: 1-10,
"""


def get_screening_results(client, db, user_id):

    docs = db.documents.find({"user": ObjectId(user_id)})

    output = []
    for doc in docs:
        doc = sanitize_data(doc)
        output.append({
            "id": doc['_id'],
            **doc,
        })

    return output


def screen_candidate(client, db, doc_ids, job_description="", key_criteria=""):

    print(job_description)
    print(key_criteria)

    for doc in doc_ids:

        doc = db.documents.find_one({"_id": ObjectId(doc)})

        print(doc)

        sleep(2)

        messages = [
            {"role": "system", "content": system.replace(
                "[DESCRIPTION]", job_description).replace("[CRITERIA]", key_criteria)},
            {"role": "user", "content": doc['content']}
        ]
        # print(messages)

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo" if False else "gpt-4o",
            response_format={"type": "json_object"},
            messages=messages,
            temperature=0.5,
        )
        # print(completion.choices[0].message.content)

        res = json.loads(completion.choices[0].message.content)

        print(res)

        # add all of the data to the document
        db.documents.update_one(
            {"_id": ObjectId(doc['_id'])},
            {"$set": {"status": "screened", **res}}
        )

    return True


def screen_candidates(client, db, user_id, job_description, key_criteria):

    docs = db.documents.find({"user": ObjectId(user_id)})

    doc_ids = []
    for doc in docs:
        print(doc['_id'], doc['name'], doc['content'][:10])

        db.documents.update_one({"_id": doc['_id']}, {
            "$set": {"status": "queued"}})

        doc_ids.append(str(doc['_id']))

    Thread(target=screen_candidate, args=(
        client, db, doc_ids, job_description, key_criteria,)).start()

    return f"screening candidates ${user_id}"
