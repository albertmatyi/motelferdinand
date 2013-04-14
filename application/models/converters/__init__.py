from datetime import datetime, date as libdate

FORMAT = '%d-%m-%Y'


class Date(object):
    def to_obj(self, sstring):
        return datetime.strptime(sstring, FORMAT).date()

    def to_str(self, date):
        return date.strftime(FORMAT)

    def is_date_type(self, taip):
        return taip is datetime or taip is libdate

date = Date()
