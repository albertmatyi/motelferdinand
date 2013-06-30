'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from google.appengine.api import mail
from flask.globals import request
from application.decorators import admin_required
from application.models.user import UserModel
from application.helpers import si18n, mail as mail_helper
import json


@app.route('/admin/user/message/<int:entity_id>', methods=['POST'])
@admin_required
def send_mail(entity_id):
    if 'data' not in request.form:
        return False
    mail_data = json.loads(request.form['data'])
    # To client
    message = mail.EmailMessage(
        sender=si18n.translate('Ferdinand Motel') +
        '<' + mail_helper.get_sender() + '>',
        subject=mail_data['subject']
    )

    user = UserModel.get_by_id(entity_id)

    message.to = user.full_name + '<' + user.email + '>'
    message.html = mail_data['body']
    message.send()

    return '{ "message" : "' + si18n.translate('Mail sent') + '"}'
