from application import app
from application.models import prop
from flask.globals import request
from application.decorators import admin_required, invalidate_cache
import json


@app.route("/admin/props/<key>", methods=["POST"])
@admin_required
@invalidate_cache('all_props')
def prop_put(key):
    p = prop.PropModel.all().filter('kkey = ', key).get()
    prop_data = request.form['data']
    p.value = prop_data
    p.put()
    return json.dumps(p.to_dict())


@app.route("/props/<key>", methods=["GET"])
@admin_required
def prop_get(key):
    ps = prop.get_all_props()
    if key in ps:
        return '{ "value" : ' + json.dumps(ps[key]) + ' }'
    return '{ "value" : "Unknown property: ' + key + '" }'


@app.route("/admin/props/", methods=["GET"])
@admin_required
def props():
    return json.dumps([p.to_dict() for p in prop.PropModel.all()])
