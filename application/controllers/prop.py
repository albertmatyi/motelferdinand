from application import app
from application.models.prop import PropModel
from flask.globals import request
from application.decorators import admin_required
import json


@app.route("/admin/props/<key>", methods=["POST"])
@admin_required
def prop_put(key):
    prop = PropModel.all().filter('kkey = ', key).get()
    prop_data = request.form['data']
    prop.value = prop_data
    prop.put()
    return json.dumps(prop.to_dict())


@app.route("/props/<key>", methods=["GET"])
@admin_required
def prop_get(key):
    for prop in PropModel.all().filter('kkey = ', key):
        return json.dumps(prop.to_dict())
    return '{ "value" : "Unknown property: ' + key + '" }'


@app.route("/admin/props/", methods=["GET"])
@admin_required
def props():
    return json.dumps([p.to_dict() for p in PropModel.all()])
