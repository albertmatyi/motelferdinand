from application import app
from wtforms.ext.appengine.db import model_form
from flask.templating import render_template
from application.models import * 
from flaskext import wtf
from flask.globals import request
from flask.helpers import flash

CategoryForm = model_form(CategoryModel, wtf.Form)

@app.route("/admin/categories/", methods=["GET"])
def admin_categories():
    categories = CategoryModel.all()
    form = CategoryForm(request.form)
    if form.validate_on_submit():
        db_obj = CategoryModel()
        form.populate_obj(db_obj)
        db_obj.put()
        flash("Category saved")
        pass
    return render_template('/category/admin_list.html', data=categories)
    pass

