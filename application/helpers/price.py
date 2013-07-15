from application.helpers import date as date_helper
import math
import logging

special_map = {
    'no': {'converter': lambda date: date},
    'week': {'converter': lambda date: date},
    'month': {'converter': lambda date: date},
    'year': {'converter': lambda date: date},
}


def in_circular_range(start, end, val):
    # eg. start: Tue end: Fri
    # or
    # eg: start: Sat end: Tue
    return ((start < end and start <= val and val < end) or
            (start > end and (val < end or val >= start)))


def check_if_date_between(converter, start_date, end_date, date):
    start = converter(start_date)
    end = converter(end_date)
    val = converter(date)
    return in_circular_range(start, end, val)


def special_applies_to(special, date):
    if 'start_date' not in special:
        special['start_date'] = date_helper.to_date(special['start'])
    if 'end_date' not in special:
        special['end_date'] = date_helper.to_date(special['end'])
    sr = special_map[special['repeat']]
    return check_if_date_between(
        sr['converter'],
        special['start_date'],
        special['end_date'], date)


def get_price_values_for_date(prices, date):
    n = len(prices['special'])
    for i in range(0, n):
        special = prices['special'][i]
        if special_applies_to(special, date):
            logging.info(
                '\tapply ' + special['repeat'] + 'ly (' +
                special['start'] + ' - ' + special['end'] + '): ' +
                str(special['values']))
            return special['values']

    return prices['values']


def get_avg_prices_for_days(prices_per_days):
    avg = []
    guests = len(prices_per_days[0])
    days = len(prices_per_days)
    logging.info('price matrix: ' + str(prices_per_days))
    for guests_idx in range(0, guests):
        avg_for_guest = reduce(
            lambda sm, price_per_day: sm + price_per_day[guests_idx],
            prices_per_days,
            0) / days
        avg += [avg_for_guest]

    logging.info('avgs: ' + str(avg))
    return avg


def get_avg_for_range(prices, start, end):
    if prices['special']\
            and len(prices['special']) > 0\
            and start < end:
        prices_per_days = []  # will contain prices for each day
        for date in date_helper.date_range(start, end):
            # for every date, retrieve price values
            vals = get_price_values_for_date(prices, date)
            logging.info('\twith vals: ' + str(vals))
            logging.info('for date: ' + str(date_helper.to_str(date)))
            prices_per_days += [vals]

        return get_avg_prices_for_days(prices_per_days)

    return prices['values']


def get_price_for(prices, quantity, guests, start, end):
    vals = get_avg_for_range(prices, start, end)
    places = len(prices['values'])
    # every room should have at least 1 guest
    price_per_day = vals[0] * quantity
    # calculate without these guests
    guests = max(0, guests - quantity)
    # nr of full rooms
    f = int(guests / (places - 1)) if places > 1 else quantity
    # nr of guests that are not in full rooms
    rg = guests % (places - 1) if places > 1 else 0
    # add prices of full rooms
    price_per_day = price_per_day - f * vals[0] + f * vals[places - 1]
    # add price_per_day of partially filled room
    price_per_day = price_per_day - vals[0] + vals[rg]

    price_per_day = math.ceil(price_per_day)

    days = (end - start).days
    return price_per_day * days
