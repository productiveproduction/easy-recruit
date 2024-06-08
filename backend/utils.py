import re
from datetime import datetime
from bson import ObjectId


def find_variables_in_prompt(prompt):
    # use regex to find variables in prompt in the form of {{variable}}
    variables = re.findall(r"{{(.*?)}}", prompt)
    return variables


def sanitize_data(value):
    if isinstance(value, dict):
        return {k: sanitize_data(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [sanitize_data(v) for v in value]
    elif isinstance(value, ObjectId):
        return str(value)
    elif isinstance(value, datetime):
        return value.isoformat()
    return value
