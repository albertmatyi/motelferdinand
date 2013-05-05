from application import app
from application.models.prop import PropsModel
from flask.globals import request
from application.decorators import admin_required


@app.route("/props/<key>", methods=["POST"])
@admin_required
def prop_put(key):
    prop_data = request.form['data']
    prop = PropsModel(kkey=key, value=prop_data)
    prop.put()
    return prop.to_dict()


@app.route("/props/<key>", methods=["GET"])
@admin_required
def prop_get(key):
    prop = PropsModel.get_by_key_name(key)
    return prop.to_dict() if prop else '{}'
