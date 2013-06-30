# -*- coding: utf-8 -*-

from flask import request


def get_lang_id():
    lang_id = request.cookies.get('lang_id')
    if not lang_id:
        lang_id = 'en'
    return lang_id


def translate(what, lang_id=''):
    if len(lang_id) == 0:
        lang_id = get_lang_id()
    if lang_id in translations and what in translations[lang_id]:
        return translations[lang_id][what]
    return 'translations.' + str(lang_id) + '.' + str(what)
    pass

translations_js = {
    'en': {
        'Booking successfully saved! Stand by for a confirmation email.': u'Booking successfully saved! Stand by for a confirmation email.',
        'Add category': u'Add category',
        'Mark as paid': u'Mark as paid',
        'Mark as unpaid': u'Mark as unpaid',
        'Are you sure you wish to delete?': u'Are you sure you wish to delete?',
        'Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.': u'Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.',
        'Accepted': u'Accepted',
        'Denied': u'Denied',
        'Moved': u'Moved',
        'New': u'New',
        'Paid': u'Paid',
        'End date must be greater than start date': u'End date must be greater than start date',
        'Start date can\'t be in the past.': u'Start date can\'t be in the past.',
        'Range can\'t contain overbooked days': u'Range can\'t contain overbooked days',
        'Saving': u'Saving',
        'Saved': u'Saved'
    },
    'hu': {
        'Booking successfully saved! Stand by for a confirmation email.': u'Foglalás sikeresen bejegyezve. Kérem várja meg a konfirmáló emailt.',
        'Add category': u'Hozzáad kategoriát',
        'Mark as paid': u'Kifizetve',
        'Mark as unpaid': u'Kifizetlen',
        'Are you sure you wish to delete?': u'Biztos benne, hogy törölni szeretné?',
        'Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.': u'Biztos benne, hogy elfogadja a foglalást? Ez művelet nem visszavonható, és a kliens is értesül róla.',
        'Accepted': u'Elfogadva',
        'Denied': u'Elutasítva',
        'Moved': u'Áthelyezve',
        'New': u'Új',
        'Paid': u'Kifizetve',
        'End date must be greater than start date': u'Végdátum nem lehet kisebb mint a kezdeti.',
        'Start date can\'t be in the past.': u'Kezdő dátum nem lehet a múltban.',
        'Range can\'t contain overbooked days': u'Az időtartam túlfoglalt napokat tartalmaz.',
        'Saving': u'Mentés',
        'Saved': u'Elmentve'
    },
    'ro': {
        'Booking successfully saved! Stand by for a confirmation email.': u'Rezervarea s-a efectuat cu succes. Vă rugăm să așteptați mailul de confirmare.',
        'Add category': u'Adaugă categorie',
        'Mark as paid': u'Marchează plătit',
        'Mark as unpaid': u'Marchează neplătit',
        'Are you sure you wish to delete?': u'Sunteți siguri că doriți să ștergeți?',
        'Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.': u'Sunteți siguri că doriți să acceptați? Această operație nu se poate modifica, iar clientul va fi notificat în urma lui.',
        'Accepted': u'Acceptat',
        'Denied': u'Refuzat',
        'Moved': u'Mutat',
        'New': u'Nou',
        'Paid': u'Plătit',
        'End date must be greater than start date': u'Data plecării este mai mică decât a sosirii.',
        'Start date can\'t be in the past.': u'Data sosirii nu poate fi în trecut',
        'Range can\'t contain overbooked days': u'Selecția conține zile suprarezervate',
        'Saving': u'Salvare',
        'Saved': u'Salvat'
    }
}

translations = {
    'en': {
        'lang_id': 'en',
        '$': 'EUR',
        'Log out': u'Log out',
        'Loading': u'Loading',
        'Settings': u'Settings',
        # Base
        'LanguageName': u'English',
        'Success': u'Success',
        'DefaultCurrency': 'EUR',
        'Ferdinand Motel': u'Ferdinand Motel',
        'Language': u'Language',
        'Date': u'Date',
        'Name': u'Name',
        'Please confirm your action.': u'Please confirm your action.',
        'Are you sure?': u'Are you sure?',
        'OK': u'OK',
        'Invalid data': u'Invalid data',
        'Modified successfully': u'Modified successfully',
        'Successfully deleted': u'Successfully deleted',
        'Landline': u'Landline',
        'Mobile': u'Mobile',
        'How to get here': u'How to get here',
        'Phone numbers': u'Phone numbers',
        'Address': u'Address',
        'Yard': u'Yard',
        'For #NR# guests': u'For #NR# guests',
        'Back': u'Back',
        'Update': u'Update',
        'Preferred language': u'Preferred language',
        'nights': u'nights',
        'Attached message': u'Attached message',
        'Client': u'Client',
        'Prices': u'Prices',
        'Discount': u'Discount',

        # Admin
        'Admin': u'Admin',
        'Guestbook entries': u'Guestbook entries',
        'Bookings': u'Bookings',
        'Booking entries': u'Booking entries',
        'Edit': u'Edit',
        'Delete': u'Delete',
        'Add content': u'Add content',
        'Add bookable': u'Add bookable',
        'Bookable': u'Bookable',
        'Range is overbooked': u'Range is overbooked',
        'Accept': u'Accept',
        'Deny': u'Deny',
        'Move to category': u'Move to category',
        'Send message': u'Send message',
        'Send': u'Send',
        'Subject': u'Subject',
        'Body': u'Body',
        'Mail sent': u'Mail sent',
        'Deny booking': u'Deny booking',
        'Deny booking and send email': u'Deny booking and send mail',
        'Prices displayed in the currency the client chose. The price of the bookable and exchange rates are the ones from the day of the booking.': u'Prices displayed in the currency the client chose. The price of the bookable and exchange rates are the ones from the day of the booking.',
        'Prices in the currently selected currency. The price of the bookable and exchange rates are the ones from the day of the booking.': u'Prices in the currently selected currency. The price of the bookable and exchange rates are the ones from the day of the booking.',

        # Booking
        'Book': u'Book',
        'available': u'available',
        'Places': u'Places',
        'Place': u'Place',
        'Guest(s)': u'Guest(s)',
        'Currency': u'Currency',
        'Price': u'Price',
        'Price per night': u'Price per night',
        'Prices starting from': u'Prices starting from',
        'Per night': u'Per night',
        'Total': u'Total',
        'Nights': u'Nights',
        'Greeting': u'Preparing coffee',
        'Full Name': u'Full Name',
        'Email': u'Email',
        'Phone': u'Phone',
        'Citizenship': u'Citizenship',
        'Booked rooms': u'Booked rooms',
        'Room type': u'Type',
        'Quantity': u'Quantity',
        'Arrival': u'Arrival',
        'Departure': u'Departure',
        'Add room': u'Add room',
        'Add room to booking': u'Add room to booking',
        'Type of room': u'Type of room',
        'Arrival date': u'Arrival date',
        'Departure date': u'Departure date',
        'Custom message': u'Custom message',
        'Cancel': u'Cancel',
        'Number of guests': u'Number of guests',
        'Guests': u'Guests',

        #Bookin validation
        'Specify a valid email address': u'Specify a valid email address',
        'Add at least one room': u'Add at least one room',
        'Specify a valid full name': u'Specify a valid full name',
        'Invalid data! See fields above.': u'Invalid data! See fields above.',
        'Specify a valid phone number': u'Specify a valid phone number',
        'Specify your citizenship': u'Specify your citizenship',
        'Specify a valid date (dd-mm-yyyy)': u'Sepcify a valid date (dd-mm-yyyy)',

        #Admin booking
        'Accepted': u'Accepted',
        'Paid': u'Paid',
        'Album url': u'Album URL',
        'State': u'State',
        'Created': u'Created',
        'Close': u'Close',
        'Mark as accepted': u'Mark as accepted',
        'Mark as paid': u'Mark as paid',
        'Contact': u'Contact',
        'Accept booking': u'Accept booking',
        'Accept booking and send email': u'Accept booking and send email',

        #Forms
        'Save': u'Save',
        'Edit category': u'Edit category',
        'Edit content': u'Edit content',
        'Edit bookable': u'Edit bookable',
        'Weight': u'Weight',
        'Weight explanation': u'The heavier the content, the lower it will appear',
        'Description': u'Description',
        'Title': u'Title',

        #Footer
        'Contact us': u'Contact us'
    },
    'hu': {
        'lang_id': 'hu',
        '$': 'HUF',
        'Log out': u'Kilép',
        'Loading': u'Pillanat',
        'Settings': u'Beállítások',
        # Base
        'LanguageName': u'Magyar',
        'Success': u'Sikeres',
        'DefaultCurrency': 'HUF',
        'Ferdinand Motel': u'Ferdinánd Panzió',
        'Language': u'Nyelv',
        'Date': u'Dátum',
        'Name': u'Név',
        'Please confirm your action.': u'Kérem igazolja választását.',
        'Are you sure?': u'Biztos benne?',
        'OK': u'OK',
        'Invalid data': u'Helytelen adatok',
        'Modified successfully': u'Módosítás sikeres',
        'Successfully deleted': u'Törlés sikeres',
        'Landline': u'Vezetékes',
        'Mobile': u'Mobil',
        'How to get here': u'Hogyan jut el hozzánk',
        'Phone numbers': u'Telefonszámok',
        'Address': u'Cím',
        'Yard': u'Udvar',
        'For #NR# guests': u'#NR# Vendég számára',
        'Back': u'Vissza',
        'Update': u'Frissítés',
        'Preferred language': u'Kedvelt nyelv',
        'nights': u'északa',
        'Attached message': u'Csatolt üzenet',
        'Client': u'Kliens',
        'Prices': u'Árak',
        'Discount': u'Kedvezmény',

        # Admin
        'Admin': u'Admin',
        'Guestbook entries': u'Bejegyzések',
        'Bookings': u'Foglalások',
        'Booking entries': u'Lefoglalt szobák',
        'Edit': u'Módosít',
        'Delete': u'Töröl',
        'Add content': u'Hozzáad tartalmat',
        'Add bookable': u'Hozzáad szobát',
        'Bookable': u'Szoba',
        'Album url': u'Album link',
        'Accept': u'Elfogad',
        'Range is overbooked': u'Időtartam túlfoglalt',
        'Deny': u'Elutasít',
        'Move to category': u'Más kategóriába helyez',
        'Send message': u'Üzenetet küld',
        'Send': u'Küld',
        'Subject': u'Cím',
        'Body': u'Tartalom',
        'Mail sent': u'Űzenet elküldve',
        'Deny booking': u'Foglalás elutasítás',
        'Deny booking and send email': u'Foglalást elutasít és email küldés',
        'Prices displayed in the currency the client chose. The price of the bookable and exchange rates are the ones from the day of the booking.': u'Az árak a kliens által választott valutában. A szoba ára illetve az árfolyam a foglalás napján mutatott értékekkel egyezik meg.',
        'Prices in the currently selected currency. The price of the bookable and exchange rates are the ones from the day of the booking.': u'Az árak a kiválasztott valutában. A szoba ára illetve az árfolyam a foglalás napján mutatott értékekkel egyezik meg.',

        # Booking
        'Book': u'Foglalás',
        'Places': u'Férőhelyek száma',
        'available': u'foglalható',
        'Place': u'Férőhely',
        'Guest(s)': u'Vendég',
        'Currency': u'Pénznem',
        'Price': u'Ár',
        'Prices starting from': u'Kezdőár',
        'Price per night': u'Ár per északa',
        'Per night': u'Per északa',
        'Total': u'Végösszeg',
        'Nights': u'Északa',
        'Greeting': u'Készül a kávé',
        'Full Name': u'Teljes név',
        'Email': u'Email',
        'Phone': u'Telefonszám',
        'Citizenship': u'Állampolgárság',
        'Booked rooms': u'Foglalásaim',
        'Room type': u'Típus',
        'Quantity': u'Mennyiség',
        'Arrival': u'Érkezés',
        'Departure': u'Távozás',
        'Add room': u'Hozzáad szobát',
        'Add room to booking': u'Hozzáad szobát a rendeléshez',
        'Type of room': u'Szoba típusa',
        'Arrival date': u'Érkezés dátuma',
        'Departure date': u'Távozás dátuma',
        'Custom message': u'További infók',
        'Cancel': u'Mégse',
        'Number of guests': u'Vendégek száma',
        'Guests': u'Vendégek',

        #Bookin validation
        'Specify a valid email address': u'Kérem adjon meg egy helyes email címet!',
        'Add at least one room': u'Adjon hozzá a foglaláshoz legalább egy szobát!',
        'Specify a valid full name': u'Kérem teljes és helyes nevet megadni.',
        'Invalid data! See fields above.': u'Helytelen adatok. Kérem javítsa ki az űrlapot.',
        'Specify your citizenship': u'Határozza meg állampolgárságát',
        'Specify a valid phone number': u'A megadott telefonszám helytelen.',
        'Specify a valid date (dd-mm-yyyy)': u'Helytelen dátum. (nn-hh-éééé)',

        #Admin booking
        'Accepted': u'Elfogadva',
        'Paid': u'Kifizetve',
        'Album url': u'Album URL',
        'State': u'Állapot',
        'Created': u'Létrehozva',
        'Close': u'Bezár',
        'Mark as accepted': u'Elfogad',
        'Mark as paid': u'Kifizetve',
        'Contact': u'Kapcsolat',
        'Accept booking': u'Foglalást elfogad',
        'Accept booking and send email': u'Foglalást elfogad és küld emailt.',

        #Forms
        'Save': u'Mentés',
        'Edit category': u'Kategória módosítás',
        'Edit content': u'Tartalom módosítás',
        'Edit bookable': u'Szoba módosítás',
        'Description': u'Leírás',
        'Weight': u'Súly',
        'Weight explanation': u'Minél súlyosabb a tartalom, annál lennebb jelenik meg.',
        'Title': u'Cím',

        #Footer
        'Contact us': u'Lépj kapcsolatba'
    },
    'ro': {
        'lang_id': 'ro',
        '$': 'RON',
        'Log out': u'Închide sesiunea',
        'Loading': u'O clipă',
        'Settings': u'Setări',
        # Base
        'LanguageName': u'Română',
        'Success': u'Success',
        'DefaultCurrency': 'RON',
        'Ferdinand Motel': u'Motel Ferdinand',
        'Language': u'Limbă',
        'Date': u'Data',
        'Name': u'Nume',
        'Please confirm your action.': u'Vă rog să confirmați acțiunea',
        'Are you sure?': u'Sunteți sigur?',
        'OK': u'OK',
        'Invalid data': u'Date greșite',
        'Modified successfully': u'Modificat cu succes',
        'Successfully deleted': u'Șters cu succes',
        'Landline': u'Fix',
        'Mobile': u'Mobil',
        'How to get here': u'Cum ajungeți aici',
        'Phone numbers': u'Numere de telefon',
        'Address': u'Adresă',
        'Yard': u'Curte',
        'For #NR# guests': u'Pentru #NR# oaspeți',
        'Back': u'Înapoi',
        'Update': u'Actualizare',
        'Preferred language': u'Limba preferată',
        'nights': u'nopți',
        'Attached message': u'Mesaj atașat',
        'Client': u'Client',
        'Prices': u'Prețuri',
        'Discount': u'Discount',

        # Admin
        'Admin': u'Admin',
        'Guestbook entries': u'Mesaje clienți',
        'Bookings': u'Rezervări',
        'Booking entries': u'Camere rezervate',
        'Edit': u'Modifică',
        'Delete': u'Șterge',
        'Add content': u'Adaugă conținut',
        'Add bookable': u'Adaugă cameră',
        'Bookable': u'Cameră',
        'Accept': u'Acceptare',
        'Range is overbooked': u'Intervalul este suprarezervat',
        'Deny': u'Refuzare',
        'Move to category': u'Mută în categoria',
        'Send message': u'Trimite mesaj',
        'Send': u'Trimite',
        'Subject': u'Subiect',
        'Body': u'Conținut',
        'Mail sent': u'Mesaj trimis',
        'Deny booking': u'Refuzare de rezervare',
        'Deny booking and send email': u'Refuză rezervarea și trimite email',
        'Prices displayed in the currency the client chose. The price of the bookable and exchange rates are the ones from the day of the booking.': u'Prețurile în valuta selectată de client. Prețul camerei respectiv ratele de valută sunt cele din ziua rezervării.',
        'Prices in the currently selected currency. The price of the bookable and exchange rates are the ones from the day of the booking.': u'Prețurile în valuta selectată. Prețul camerei respectiv ratele de valută sunt cele din ziua rezervării.',


        # Booking
        'Book': u'Rezervă',
        'Places': u'Locuri',
        'available': u'disponibil(e)',
        'Place': u'Loc',
        'Guest(s)': u'Oaspet(i)',
        'Currency': u'Mondeda',
        'Price': u'Preț',
        'Price per night': u'Preț per noapte',
        'Prices starting from': u'Prețurile încep de la',
        'Per night': u'Per noapte',
        'Total': u'Total',
        'Nights': u'Nopți',
        'Greeting': u'Se prepară cafeaua',
        'Full Name': u'Nume complet',
        'Email': u'Email',
        'Phone': u'Număr de telefon',
        'Citizenship': u'Cetățenie',
        'Booked rooms': u'Camere rezervate',
        'Room type': u'Tip',
        'Quantity': u'Cantitate',
        'Arrival': u'Sosire',
        'Departure': u'Plecare',
        'Add room': u'Adaugă cameră',
        'Add room to booking': u'Adaugă o cameră la rezervare',
        'Type of room': u'Tipul camerei',
        'Arrival date': u'Data sosirii',
        'Custom message': u'Informații adiționale',
        'Departure date': u'Data plecării',
        'Cancel': u'Anulează',
        'Number of guests': u'Numărul oaspeților',
        'Guests': u'Oaspeți',

        #Bookin validation
        'Specify a valid email address': u'Secificați o adresă de email valid.',
        'Add at least one room': u'Adăugați cel puțin o cameră.',
        'Specify a valid full name': u'Introduceți un nume complet și valid.',
        'Invalid data! See fields above.': u'Date invalide! Vă rugăm verificați câmpurile.',
        'Specify your citizenship': u'Specificați cetățenia Dvs.',
        'Specify a valid phone number': u'Numărul specificat este invalid.',
        'Specify a valid date (dd-mm-yyyy)': u'Dată greșită (zz-ll-aaaa)',

        #Admin booking
        'Accepted': u'Acceptat',
        'Paid': u'Plătit',
        'Album url': u'Link către album',
        'State': u'Stare',
        'Created': u'Creat',
        'Close': u'Închide',
        'Mark as accepted': u'Acceptă',
        'Mark as paid': u'Marchează plătit',
        'Contact': u'Contact',
        'Accept booking': u'Acceptă rezervarea',
        'Accept booking and send email': u'Acceptă rezervarea și trimite email',

        #Forms
        'Save': u'Salvează',
        'Edit category': u'Modifică categoria',
        'Edit content': u'Modifică conținut',
        'Edit bookable': u'Modifică cameră',
        'Description': u'Descriere',
        'Weight': u'Greutate',
        'Weight explanation': u'Cu cât mai greu este conținutul, cu atât apare mai în josul paginii.',
        'Title': u'Titlu',

        #Footer
        'Contact us': u'Contactează-ne'
    }
}

TEMPLATES = {
    'BOOKING': {
        'subject': {
            'en': u'Your booking request at Ferdinand Motel',
            'hu': u'A foglalása a Ferdinánd Panziónál',
            'ro': u'Cererea de rezervare - Pensiune Ferdnand'
        },
        'body': {
            'en': u'''
            ''',
            'hu': u'''
    Kedves $NAME,
Megkaptuk foglalási kérését. Kérem várjon míg munkatársaink felveszik Önnel a kapcsolatot.

    Köszönjük,
    Ferdinand Panzión
            ''',
            'ro': u'''
    Stimate $NAME,
Vă rog să ne permiteți să procesăm solicitarea de Dvs. de rezervare.
Revenim în curând,

    Cu respect,
    Pensiunea Ferdinand
            '''
        }
    }
}
