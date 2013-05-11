from application import app
from application.models.prop import PropModel
from flask.globals import request
from application.decorators import admin_required
import json


@app.route("/props/<key>", methods=["POST"])
@admin_required
def prop_put(key):
    prop_data = request.form['data']
    prop = PropModel(kkey=key, value=prop_data)
    prop.put()
    return prop.to_dict()


@app.route("/props/<key>", methods=["GET"])
@admin_required
def prop_get(key):
    for prop in PropModel.all().filter('kkey = ', key):
        if prop:
            return json.dumps(prop.to_dict())
        else:
            return '{}'
