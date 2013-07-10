'''
Created on Jul 26, 2012

@author: matyas
'''
from flask.globals import request
import json
import logging


def save_obj_from_req(Model):
    raw_data = request.form['data']
    logging.info(raw_data)
    data = json.loads(raw_data)
    if 'id' in data and len(data['id']) > 0:
        db_obj = Model.get_by_id(int(data['id']))
    else:
        db_obj = Model()
    db_obj.populate(data)
    db_obj.put()
    return db_obj
