from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from application.controllers import helpers
from werkzeug.utils import redirect
from flask.helpers import url_for
from wtforms.ext.appengine.fields import ReferencePropertyField
import wtforms
from flaskext import wtf
from wtforms.form import FormMeta



def create_form(model, name):
    # the inner class is the only useful bit of your ModelForm
    class Meta:
        pass
    field_args = {}
    setattr(Meta, 'model', model)
    for prop in CategoryModel.properties():
        if prop.endswith('_id'):
            type_name = prop.split('_id')[0]
            type_name = type_name[0].capitalize()+type_name[1:] 
            typ3 = type(type_name, AbstractModel) if type_name != "Parent" else model
            field_args[prop] = ReferencePropertyField(reference_class=typ3, allow_blank=True, blank_text='ROOT')

    form = model_form(model, wtf.Form)
    for name, field in field_args.items():
#        field.bind(form, name)
        FormMeta.__setattr__(form, name, field)
    return form
#    return model_form(CategoryModel, wtf.Form)

CategoryForm = create_form(CategoryModel, 'CategoryForm')

@app.route("/", methods=["GET"])
def home():
    return redirect(url_for('admin_categories'))

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
