from application import app
from application.decorators import admin_required
from application.models.category import CategoryModel
from application.models.booking import BookingModel
from application.models import prop
from application.controllers import helpers
from werkzeug.utils import redirect
from flask.helpers import url_for
from flask import Response
from flask.templating import render_template
from flask.globals import request
from application.helpers import si18n
from google.appengine.api import users
import os
from application.helpers import currency


@app.errorhandler(500)
def page_not_found(error):
    if request.is_xhr:
        data = '{ "message" : "' +\
            si18n.translate(unicode(error.message)) + '"}'
        resp = Response(status=500)
        resp.mimetype = 'application/json'
        resp.data = data
        return resp
    return unicode(error)


@app.route("/", methods=["GET"])
def home():
    lang_id = si18n.get_lang_id()
    is_admin = users.is_current_user_admin()

    qry = CategoryModel.all().filter('parent_category', None)
    if not is_admin:
        qry = qry.filter('visible', True)

    categories = [e.to_dict() for e in qry]
    prod = 'Development' not in os.environ['SERVER_SOFTWARE']
    return render_template(
        '/main.html',
        js_data={
            'categories': categories,
            'languages': prop.languages,
            'currency': currency.get_data(),
            'language': lang_id,
            'bookings': [],
            'si18n': si18n.translations_js,
            'is_admin': is_admin,
            'new_bookings_nr':
            BookingModel.get_number_of_new() if is_admin else 0
        }, is_admin=is_admin,
        is_production=prod,
        logout_url=users.create_logout_url("/"))
    pass


@app.route("/admin/")
@admin_required
def admin():
    return redirect(url_for('home'), 302)
    pass


@app.route("/admin/categories/", methods=["POST"])
@admin_required
def admin_categories():
    cat_id = helpers.save_obj_from_req(CategoryModel).key().id()
    return "{ \"id\" : \"" + str(cat_id) + "\" }"
    pass


@app.route('/admin/categories/<int:entityId>', methods=['POST', 'DELETE'])
@admin_required
def admin_delete_category(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        CategoryModel.get_by_id(entityId).delete()
        return "{ \"value\" : \"OK\" }"
