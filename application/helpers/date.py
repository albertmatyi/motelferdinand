from datetime import datetime, date, timedelta
import re

DATE_FORMAT = '%d-%m-%Y'


def validate_date(date_str):
    if re.match('^\d{2}-\d{2}-\d{4}$', date_str) is None:
        raise Exception('Invalid date: ' + date_str)


def to_date(sstring):
    return datetime.strptime(sstring, DATE_FORMAT).date()


def to_str(date):
    return date.strftime(DATE_FORMAT)


def is_date_type(taip):
    return taip is datetime or taip is date


def date_range(start, end):
    for d in range(0, (end - start).days):
        yield start + timedelta(d)
