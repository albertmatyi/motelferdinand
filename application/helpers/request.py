from flask.globals import request
import json
import logging


def get_json_data():
    try:
        for d in request.form:
            logging.warn(d)
        data = request.form['data']
        return json.loads(data)
        pass
    except Exception, e:
        logging.error('Cannot load json data from request')
        raise e
