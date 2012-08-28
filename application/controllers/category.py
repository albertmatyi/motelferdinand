from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from application.controllers import helpers
from werkzeug.utils import redirect
from flask.helpers import url_for
from flaskext import wtf
from flask.templating import render_template

CategoryForm = model_form(CategoryModel, wtf.Form)

@app.route("/", methods=["GET"])
def home():
    return render_template('/main.html', categories=CategoryModel.all().filter('visible', True),\
                                         contents=ContentModel.all().filter('visible', True),\
                                         bookables=BookableModel.all().filter('visible', True),\
                                         )

@app.route("/admin/categories/", methods=["GET", "POST"])
def admin_categories():
    return helpers.admin_list(CategoryModel, CategoryForm, 'admin_categories')
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
