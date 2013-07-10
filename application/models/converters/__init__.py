from datetime import datetime, date as libdate
import re

DATE_FORMAT = '%d-%m-%Y'


def validate_date(date_str):
    if re.match('^\d{2}-\d{2}-\d{4}$', date_str) is None:
        raise Exception('Invalid date: ' + date_str)


class Date(object):
    def to_obj(self, sstring):
        return datetime.strptime(sstring, DATE_FORMAT).date()

    def to_str(self, date):
        return date.strftime(DATE_FORMAT)

    def is_date_type(self, taip):
        return taip is datetime or taip is libdate

date = Date()
