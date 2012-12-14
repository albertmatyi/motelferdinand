from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from application.controllers import helpers
from werkzeug.utils import redirect
from flask.helpers import url_for
from flaskext import wtf
from flask.templating import render_template
from flask.globals import request
import pdb

CategoryForm = model_form(CategoryModel, wtf.Form)

@app.route("/", methods=["GET"])
def home():
    return render_template('/main.html',\
                             js_data = {'categories': [e.to_dict() for e in CategoryModel.all().filter('visible', True)\
                                                       .filter('parent_category', None)],\
                                        'languages': [e.to_dict() for e in LanguageModel.all()],
                                        'language' : 'en',
                                        'is_admin' : True
                            })

@app.route("/admin/initdb")
def initdb():
    init_db()
    return redirect(url_for('home'), 302)
    pass
    

@app.route("/admin/categories/", methods=["POST"])
def admin_categories():
    if 'id' in request.form and len(request.form['id']) > 0:
        db_obj = CategoryModel.get_by_id(int(request.form['id']))
    else:
        db_obj = CategoryModel()
    # pdb.set_trace()
    db_obj.populate(request.form)
    db_obj.put()
    return "{ 'response' : 'SUCKSESS' }"
    pass


@app.route("/admin/categories/new", methods=["GET"])
def admin_new_category():
    return helpers.admin_new(CategoryForm, 'admin_categories')
    pass

@app.route("/admin/categories/<int:mdl_id>", methods=["GET", "POST", "PUT", "DELETE"])
def admin_edit_category(mdl_id):
    return helpers.admin_edit(mdl_id, CategoryModel, CategoryForm, \
                              'admin_edit_category', 'admin_categories');
    pass
