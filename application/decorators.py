"""
decorators.py

Decorators for URL handlers

"""

from functools import wraps
from google.appengine.api import users
from flask import redirect, request
from google.appengine.api import memcache


def login_required(func):
    """Requires standard login credentials"""
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not users.get_current_user():
            return redirect(users.create_login_url(request.url))
        return func(*args, **kwargs)
    return decorated_view


def admin_required(func):
    """Requires App Engine admin credentials"""
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not users.is_current_user_admin():
            return redirect(users.create_login_url(request.url))
        return func(*args, **kwargs)
    return decorated_view


def cached(key, time=0):
    """Retrieves a cached value of the method, or creates a new one"""
    def get_cached_val_wrapper(func):
        @wraps(func)
        def get_cached_val(*args, **kwargs):
            data = memcache.get(key)
            if data is None:
                data = func(*args, **kwargs)
                memcache.set(key, data, time)
            return data
        return get_cached_val
    return get_cached_val_wrapper


def invalidate_cache(key):
    """Deletes a cached value"""
    def del_cached_val_wrapper(func):
        @wraps(func)
        def del_cached_val(*args, **kwargs):
            memcache.delete(key)
            # raise Exception('removing value')
            return func(*args, **kwargs)
        return del_cached_val
    return del_cached_val_wrapper
