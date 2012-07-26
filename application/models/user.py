'''
Created on Jul 26, 2012

@author: matyas
'''
from application.models import AbstractModel
from google.appengine.ext import db

ROLE_ADMIN = 1 
ROLE_COLLABORATOR = 2
ROLE_USER = 3


class UserModel(AbstractModel):
    email = db.StringProperty(required=False, default='')
    auth_domain = db.StringProperty(required=False, default='')
    federated_identity = db.StringProperty(required=False, default='')
    federated_provider = db.StringProperty(required=False, default='')
    nickname = db.StringProperty(required=False, default='')
    user_id = db.StringProperty(required=False, default='')
    role_id = db.IntegerProperty(required=True, default=ROLE_USER)
