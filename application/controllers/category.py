from application import app
from application.decorators import admin_required
from wtforms.ext.appengine.db import model_form
from application.models import * 
from application.controllers import helpers
from werkzeug.utils import redirect
from flask.helpers import url_for
from flaskext import wtf
from flask.templating import render_template
from flask.globals import request
from application.helpers import si18n 
from google.appengine.api import users
import pdb

CategoryForm = model_form(CategoryModel, wtf.Form)

@app.route("/", methods=["GET"])
def home():
    lang_id = si18n.get_lang_id()
    is_admin = users.is_current_user_admin()

    qry = CategoryModel.all().filter('parent_category', None)
    if not is_admin:
        qry = qry.filter('visible', True)
    categories = [e.to_dict() for e in qry]
    bookings = [e.to_dict(is_admin) for e in BookingModel.all()]
    
    return render_template('/main.html',\
                             js_data = {'categories': categories,\
                                        'languages': [e.to_dict() for e in LanguageModel.all()],
                                        'language' : lang_id,
                                        'bookings' : bookings,
                                        'si18n': si18n.translations_js,
                                        'is_admin' : is_admin
                            }, is_admin = is_admin,
                            logout_url = users.create_logout_url("/"))
    pass

@app.route("/admin/")
@admin_required
def admin():
    return redirect(url_for('home'), 302)
    pass

@app.route("/admin/initdb")
@admin_required
def initdb():
    init_db()
    return redirect(url_for('home'), 302)
    pass
    

@app.route("/admin/categories/", methods=["POST"])
@admin_required
def admin_categories():
    return "{ \"id\" : \""+str(helpers.save_obj_from_req(CategoryModel).key().id()) + "\" }";
    pass

@app.route('/admin/categories/<int:entityId>', methods=['POST', 'DELETE'])
@admin_required
def admin_delete_category(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        CategoryModel.get_by_id(entityId).delete()
        return "{ \"value\" : \"OK\" }"
    pass