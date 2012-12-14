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
    return str(helpers.save_obj_from_req(CategoryModel).key().id());
    pass
