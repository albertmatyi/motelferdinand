

class BookingState:
        INITIAL = 1
        DENIED = 2
        ACCEPTED = 3
        PAID = 4
        transitions = {
            (INITIAL, DENIED),
            (INITIAL, ACCEPTED),
            (ACCEPTED, PAID),
            (PAID, ACCEPTED),
        }
