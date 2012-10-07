'''
Created on Jul 26, 2012

@author: matyas
'''
from flask.globals import request
from flask.templating import render_template
from flask.helpers import flash, url_for
from werkzeug.utils import redirect

def admin_handle_post(Model, Form, successURL):
    '''
    POST: If it was a post method, it will save the posted entity data to the model
    
    @param Model: The model class to read all entities from / to persist the new one to
    @param Form: The form class that will help to load the data from the request in case of save
    @param successURL: The url a successful save redirects to
    '''
    if request.method == "POST":
        form = Form(request.form)
        if form.validate_on_submit():
            db_obj = Model()
            form.populate_obj(db_obj)
            db_obj.put()
            flash("Data saved successfully!", "success")
            return redirect(url_for(successURL))
            pass
        else:
            flash("Invalid data. Check description near fields.", "error")
            return render_template('/base/admin_edit.html', form=form)

def admin_list(Model, Form, successURL, template='/base/admin_list.html', filtr=lambda qry: qry):
    '''
    GET: Renders a list of all the objs in the model
    POST: Creates a new entity in the model
    
    @param Model: The model class to read all entities from / to persist the new one to
    @param Form: The form class that will help to load the data from the request in case of save
    @param successURL: The url a successful save redirects to
    @param template: The path to the template to be rendered (default: /base/admin_list.html )
    @param filtr: A custom method that receives a query and returns it filtered (default: lambda q:q)
    @return: The rendered list of the objects 
    '''
    form = Form(request.form)
    if request.method == "POST":
        if form.validate_on_submit():
            db_obj = Model()
            form.populate_obj(db_obj)
            db_obj.put()
            flash("Data saved successfully!", "success")
            return redirect(url_for(successURL))
            pass
        else:
            flash("Invalid data. Check description near fields.", "error")
            return render_template('/base/admin_edit.html', form=form)
    objs = filtr(Model.all())
    return render_template(template, list=objs, properties=Model.properties())
    pass




def admin_new(Form, action):
    '''
    Renders a form that will permit entering new data. 
    
    @param FormClass: The class that helps to render the form
    @param action: The action the user is redirected to after save
    @return: The page to be rendered
    '''
    form = Form(request.form)
    return render_template('/base/admin_edit.html', form=form, action=url_for(action))
    pass


def admin_edit(mdl_id, Model, Form, action, successURL):
    '''
        GET: Renders a form for editing a given object in the model
        PUT or POST + ?_method=PUT: Updates an object in the model and redirects to successURL 
        DELETE or POST + ?_method=DELETE: Deletes an object from the model and redirects to successURL
        
        @param mdl_id: The id of the object to update
        @param Model: The class of the Model to search for the object
        @param Form: The class of the form to be rendered
        @param action: The action the form should be posted to
        @param successURL: The url a successful edit/delete should redirect
    '''
    db_obj = Model.get_by_id(mdl_id)
    if request.method == 'POST':
        if request.method == 'PUT' or request.values['_method'] == 'PUT':
            # it's an update
            form = Form(request.form)
            if form.validate_on_submit():
                db_obj = Model.get_by_id(mdl_id)
                form.populate_obj(db_obj)
                db_obj.put()
                flash("Data saved successfully!", "success")
                return redirect(url_for(successURL))
            pass
        elif request.method == 'DELETE' or request.values['_method'] == 'DELETE':
            db_obj.delete()
            flash("Data deleted successfully!", "success")
            return redirect(url_for(successURL))
            pass
        flash("Invalid data. Check description near fields.", "error")        
        form = Form(request.form)
    else:
        form = Form(request.form, db_obj)
    return render_template('/base/admin_edit.html', form=form, action=url_for(action, mdl_id=mdl_id)+'?_method=PUT')
    pass