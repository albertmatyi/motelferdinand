from application import app
from application.decorators import admin_required
from application.models import db
from werkzeug.utils import redirect
from flask.helpers import url_for


@app.route("/admin/db/init")
@admin_required
def init():
    db.init()
    return redirect(url_for('home'), 302)
    pass


@app.route("/admin/db/migrate/<int:ver>")
@admin_required
def migrate(ver):
    db.migrate(ver)
    return redirect(url_for('home'), 302)
    pass


@app.route("/admin/db/fix_picaslide")
@admin_required
def fix_picaslide():
    db.fix_picaslide()
    return redirect(url_for('home'), 302)
    pass
