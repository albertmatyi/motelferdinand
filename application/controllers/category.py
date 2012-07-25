from application import app
from wtforms.ext.appengine.db import model_form
from flask.templating import render_template
from application.models import * 
from flaskext import wtf
from flask.globals import request
from flask.helpers import flash, url_for
from flaskext.wtf.form import Form
from werkzeug.utils import redirect

CategoryForm = model_form(CategoryModel, wtf.Form)

@app.route("/admin/categories/", methods=["GET", "POST"])
def admin_list():
    categories = CategoryModel.all()
    form = CategoryForm(request.form)
    if request.method == "POST":
        if form.validate_on_submit():
            db_obj = CategoryModel()
            form.populate_obj(db_obj)
            db_obj.put()
            flash("Data saved successfully!", "success")
            return redirect(url_for('admin_list'))
            pass
        else:
            flash("Invalid data. Check description near fields.", "error")
            return render_template('/base/admin_edit.html', form=form)
    form = Form()
    return render_template('/base/admin_list.html', list=categories, properties=CategoryModel.properties())
    pass


@app.route("/admin/categories/new", methods=["GET"])
def admin_new():
    form = CategoryForm(request.form)
    return render_template('/base/admin_edit.html', form=form)
    pass

@app.route("/admin/categories/<int:mdl_id>", methods=["GET", "POST"])
def admin_edit(mdl_id):
    db_obj = CategoryModel.get_by_id(mdl_id);
    form = CategoryForm(request.form, db_obj)
    return render_template('/base/admin_edit.html', form=form)
    pass