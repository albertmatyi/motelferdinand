'''
Created on Jul 26, 2012

@author: matyas
'''
from flask.globals import request
from flask.templating import render_template
from flask.helpers import flash, url_for
from werkzeug.utils import redirect
import pdb

def save_obj_from_req(Model):
    if 'id' in request.form and len(request.form['id']) > 0:
        db_obj = Model.get_by_id(int(request.form['id']))
    else:
        db_obj = Model()
    # pdb.set_trace()
    db_obj.populate(request.form)
    db_obj.put()
    return db_obj
    pass

def dictify_keys(dictionary):
    '''
        Recursively transforms dotseparated keys to subdictionaries.
        @return A new dictionary containing all suchformed keys
        e.g 
        dictify_keys({ a.b.c : val }) will return
        { a : { b : { c : val }}}
    '''
    ret = {}
    for key, value in dictionary.items():
        keys = key.split('.')
        kn = len(keys)
        dst = ret
        for i in range(0, kn):
            if i is kn-1:
                dst[keys[i]] = value
            else:
                if keys[i] not in dst:
                    dst[keys[i]] = {}
                dst = dst[keys[i]]
                pass
        pass
    return ret
    pass