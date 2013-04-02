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
	return 'translations.'+str(lang_id)+'.'+str(what)
	pass

translations_js = {
	'en': {
		'Booking successfully saved! Stand by for a confirmation email.': u'Booking successfully saved! Stand by for a confirmation email.',
		'Add category': u'Add category',
		'Mark as paid': u'Mark as paid',
		'Mark as unpaid': u'Mark as unpaid',
		'Are you sure you wish to delete?': u'Are you sure you wish to delete?',
		'Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.': u'Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.'
	},
	'hu': {
		'Booking successfully saved! Stand by for a confirmation email.': u'Foglalás sikeresen bejegyezve. Kérem várja meg a konfirmáló emailt.',
		'Add category': u'Hozzáad kategoriát',
		'Mark as paid': u'Kifizetve',
		'Mark as unpaid': u'Kifizetlen',
		'Are you sure you wish to delete?': u'Biztos benne, hogy törölni szeretné?',
		'Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.': u'Biztos benne, hogy elfogadja a foglalást? Ez művelet nem visszavonható, és a kliens is értesül róla.'
	},
	'ro': {
		'Booking successfully saved! Stand by for a confirmation email.': u'Rezervarea s-a efectuat cu succes. Vă rugăm să așteptați mailul de confirmare.',
		'Add category': u'Adaugă categorie',
		'Mark as paid': u'Marchează plătit',
		'Mark as unpaid': u'Marchează neplătit',
		'Are you sure you wish to delete?': u'Sunteți siguri că doriți să ștergeți?',
		'Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.': u'Sunteți siguri că doriți să acceptați? Această operație nu se poate modifica, iar clientul va fi notificat în urma lui.'
	}
}

translations = {
	'en' : {
		'lang_id':'en',
		'Log out': u'Log out',
		# Base
		'LanguageName': u'English',
		'Ferdinand Motel': u'Ferdinand Motel',
		'Language': u'Language',
		'Date': u'Date',
		'Name': u'Name',
		'Please confirm your action.' : u'Please confirm your action.',
		'Are you sure?' : u'Are you sure?',
		'OK' : u'OK',
		'Invalid data': u'Invalid data',
		'Modified successfully': u'Modified successfully',
		'Successfully deleted': u'Successfully deleted',
		'Landline': u'Landline',
		'Mobile': u'Mobile',
		'How to get here': u'How to get here',
		'Phone numbers': u'Phone numbers',
		'Address': u'Address',
		'Yard': u'Yard',

		# Admin
		'Admin':u'Admin',
		'Guestbook entries': u'Guestbook entries',
		'Bookings': u'Bookings',
		'Booking entries': u'Booking entries',
		'Edit': u'Edit',
		'Delete': u'Delete',
		'Add content': u'Add content',
		'Add bookable': u'Add bookable',

		# Booking
		'Book': u'Book',
		'Beds': u'Beds',
		'Price per night' : u'Price',
		'$': u'RON',
		'Greeting': u'Preparing coffee',
		'Full Name': u'Full Name',
		'Email': u'Email',
		'Phone': u'Phone',
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
		'Guests' : u'Guests',

		#Bookin validation
		'Specify a valid email address': u'Specify a valid email address',
		'Add at least one room': u'Add at least one room',
		'Specify a valid full name': u'Specify a valid full name',
		'Invalid data! See fields above.': u'Invalid data! See fields above.',
		'Specify a valid phone number': u'Specify a valid phone number',
		'Specify a valid date (dd-mm-yyyy)': u'Sepcify a valid date (dd-mm-yyyy)',

		#Admin booking
		'Accepted': u'Accepted',
		'Paid': u'Paid',
		'Album url': u'Album URL',
		'Status': u'Status',
		'Created': u'Created',
		'Close': u'Close',
		'Mark as accepted': u'Mark as accepted',
		'Mark as paid': u'Mark as paid',
		'Contact': u'Contact',

		#Forms
		'Save': u'Save',
		'Edit category': u'Edit category',
		'Edit content': u'Edit content',
		'Edit bookable': u'Edit bookable',
		'Description': u'Description',
		'Title': u'Title',

		#Footer
		'Find us on': u'Find us'
	},
	'hu' : {
		'lang_id':'hu',
		'Log out': u'Kilép',
		# Base
		'LanguageName': u'Magyar',
		'Ferdinand Motel': u'Ferdinánd Panzió',
		'Language': u'Nyelv',
		'Date': u'Dátum',
		'Name': u'Név',
		'Please confirm your action.' : u'Kérem igazolja választását.',
		'Are you sure?' : u'Biztos benne?',
		'OK' : u'OK',
		'Invalid data': u'Helytelen adatok',
		'Modified successfully': u'Módosítás sikeres',
		'Successfully deleted': u'Törlés sikeres',
		'Landline': u'Vezetékes',
		'Mobile': u'Mobil',
		'How to get here': u'Hogyan jut el hozzánk',
		'Phone numbers': u'Telefonszámok',
		'Address': u'Cím',
		'Yard': u'Udvar',

		# Admin
		'Admin': u'Admin',
		'Guestbook entries': u'Bejegyzések',
		'Bookings': u'Foglalások',
		'Booking entries': u'Lefoglalt szobák',
		'Edit': u'Módosít',
		'Delete': u'Töröl',
		'Add content': u'Hozzáad tartalmat',
		'Add bookable': u'Hozzáad szobát',
		'Album url': u'Album link',

		# Booking
		'Book': u'Foglalás',
		'Beds': u'Ágyak száma',
		'Price per night' : u'Ár/éjszaka',
		'$': u'HUF',
		'Greeting': u'Készül a kávé',
		'Full Name': u'Teljes név',
		'Email': u'Email',
		'Phone': u'Telefonszám',
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
		'Guests' : u'Vendégek',

		#Bookin validation
		'Specify a valid email address': u'Kérem adjon meg egy helyes email címet!',
		'Add at least one room': u'Adjon hozzá a foglaláshoz legalább egy szobát!',
		'Specify a valid full name': u'Kérem teljes és helyes nevet megadni.',
		'Invalid data! See fields above.': u'Helytelen adatok. Kérem javítsa ki az űrlapot.',
		'Specify a valid phone number': u'A megadott telefonszám helytelen.',
		'Specify a valid date (dd-mm-yyyy)': u'Helytelen dátum. (nn-hh-éééé)',

		#Admin booking
		'Accepted': u'Elfogadva',
		'Paid': u'Kifizetve',
		'Album url': u'Album URL',
		'Status': u'Státus',
		'Created': u'Létrehozva',
		'Close': u'Bezár',
		'Mark as accepted': u'Elfogad',
		'Mark as paid': u'Kifizetve',
		'Contact': u'Kapcsolat',

		#Forms
		'Save': u'Mentés',
		'Edit category': u'Kategória módosítás',
		'Edit content': u'Tartalom módosítás',
		'Edit bookable': u'Apartman módosítás',
		'Description': u'Leírás',
		'Title': u'Cím',

		#Footer
		'Find us on': u'Itt találsz minket'
	}, 
	'ro' : {
		'lang_id':'ro',
		'Log out': u'Închide sesiunea',
		# Base
		'LanguageName': u'Română',
		'Ferdinand Motel': u'Motel Ferdinand',
		'Language': u'Limbă',
		'Date': u'Data',
		'Name': u'Nume',
		'Please confirm your action.' : u'Vă rog să confirmați acțiunea',
		'Are you sure?' : u'Sunteți sigur?',
		'OK' : u'OK',
		'Invalid data': u'Date greșite',
		'Modified successfully': u'Modificat cu succes',
		'Successfully deleted': u'Șters cu succes',
		'Landline': u'Fix',
		'Mobile': u'Mobil',
		'How to get here': u'Cum ajungeți aici',
		'Phone numbers': u'Numere de telefon',
		'Address': u'Adresă',
		'Yard': u'Curte',

		# Admin
		'Admin': u'Admin',
		'Guestbook entries': u'Mesaje clienți',
		'Bookings': u'Rezervări',
		'Booking entries': u'Camere rezervate',
		'Edit': u'Modifică',
		'Delete': u'Șterge',
		'Add content': u'Adaugă conținut',
		'Add bookable': u'Adaugă cameră',

		# Booking
		'Book': u'Rezervă',
		'Beds': u'Paturi',
		'Price per night' : u'Preț',
		'$': u'RON',
		'Greeting': u'Se prepară cafeaua',
		'Full Name': u'Nume complet',
		'Email': u'Email',
		'Phone': u'Număr de telefon',
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
		'Guests' : u'Oaspeți',

		#Bookin validation
		'Specify a valid email address': u'Secificați o adresă de email valid.',
		'Add at least one room': u'Adăugați cel puțin o cameră.',
		'Specify a valid full name': u'Introduceți un nume complet și valid.',
		'Invalid data! See fields above.': u'Date invalide! Vă rugăm verificați câmpurile.',
		'Specify a valid phone number': u'Numărul specificat este invalid.',
		'Specify a valid date (dd-mm-yyyy)': u'Dată greșită (zz-ll-aaaa)',

		#Admin booking
		'Accepted': u'Acceptat',
		'Paid': u'Plătit',
		'Album url': u'Link către album',
		'Status': u'Status',
		'Created': u'Creat',
		'Close': u'Închide',
		'Mark as accepted': u'Acceptă',
		'Mark as paid': u'Marchează plătit',
		'Contact': u'Contact',

		#Forms
		'Save': u'Salvează',
		'Edit category': u'Modifică categoria',
		'Edit content': u'Modifică conținut',
		'Edit bookable': u'Modifică cameră',
		'Description': u'Descriere',
		'Title': u'Titlu',

		#Footer
		'Find us on': u'Așa ne poți găsi'
	}
}




TEMPLATES = {
	'BOOKING' : {
		'subject' : { 
			'en' : u'Your booking request at Ferdinand Motel',
			'hu' : u'A foglalása a Ferdinánd Panziónál',
			'ro' : u'Cererea de rezervare - Pensiune Ferdnand'
		},
		'body' : {
			'en' : u'''
			''',
			'hu' : u'''
	Kedves $NAME,
Megkaptuk foglalási kérését. Kérem várjon míg munkatársaink felveszik Önnel a kapcsolatot.

	Köszönjük,
	Ferdinand Panzión
			''',
			'ro' : u'''
	Stimate $NAME,
Vă rog să ne permiteți să procesăm solicitarea de Dvs. de rezervare. 
Revenim în curând,

	Cu respect,
	Pensiunea Ferdinand
			'''
		}
	}
};

