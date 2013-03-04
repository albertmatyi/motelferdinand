'''
Created on Jul 26, 2012

@author: matyas
'''
from flask.globals import request
from flask.templating import render_template
from flask.helpers import flash, url_for
from werkzeug.utils import redirect
import logging
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
    # pdb.set_trace()
    for key, value in dictionary.items(True):
        logging.info('key: ' + str(key))
        keys = key.split('.')
        kn = len(keys)
        dst = ret
        for i in range(0, kn):
            # pdb.set_trace()
            # logging.info('key: ' + str(keys[i]))
            is_array = keys[i].endswith('[]')
            # logging.info('keys: ' + str(keys))
            k = keys[i][0:-2] if is_array else keys[i]
            if i is kn-1:
                if is_array :
                    # logging.info('adding ' + value + ' to ' + str(dst) + '.' + k )
                    dst[k] += [value]
                else:
                    # logging.info('setting ' + str(dst) + '.' + k + ' to ' + value)
                    dst[k] = value
            else:
                if k not in dst:
                    # logging.info('setting ' + str(dst) + '.' + k + ' to a new ' + ('array' if is_array else 'dict'))
                    dst[k] = [{}] if is_array else {}
                if is_array:
                    next_key = keys[i+1]
                    next_key = next_key[0:-2] if next_key.endswith('[]') else next_key
                    if next_key in dst[k][-1]:
                        dst[k] += [{}]
                    # logging.info('moving head ptr to ' + str(dst) + '.' + k + '[-1]')
                    dst = dst[k][-1]
                else:
                    # logging.info('moving head ptr to ' + str(dst) + '.' + keys[i])
                    dst = dst[keys[i]]
            pass
        pass
    return ret
    pass