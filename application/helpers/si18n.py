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
		'Mark as unpaid': u'Mark as unpaid'
	},
	'hu': {
		'Booking successfully saved! Stand by for a confirmation email.': u'Foglalás sikeresen bejegyezve. Kérem várja meg a konfirmáló emailt.',
		'Add category': u'Hozzáad kategoriát',
		'Mark as paid': u'Kifizetve',
		'Mark as unpaid': u'Kifizetlen'

	},
	'ro': {
		'Booking successfully saved! Stand by for a confirmation email.': u'Rezervarea s-a efectuat cu succes. Vă rugăm să așteptați mailul de confirmare.',
		'Add category': u'Adaugă categorie',
		'Mark as paid': u'Marchează plătit',
		'Mark as unpaid': u'Marchează neplătit'
	}
}

translations = {
	'en' : {
		# Base
		'LanguageName': u'English',
		'Ferdinand Motel': u'Ferdinand Motel',
		'Language': u'Language',
		'Date': u'Date',
		'Name': u'Name',
		'Please confirm your action.' : u'Please confirm your action.',
		'Are you sure?' : u'Are you sure?',
		'OK' : u'OK',

		# Admin
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
		'Cancel': u'Cancel',

		#Bookin validation
		'Specify a valid email address': u'Specify a valid email address',
		'Add at least one room': u'Add at least one room',
		'Specify a valid full name': u'Specify a valid full name',
		'Invalid data! See fields above.': u'Invalid data! See fields above.',
		'Specify a valid phone number': u'Specify a valid phone number',

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
		'Find us on': u'Find us on'
	},
	'hu' : {
		# Base
		'LanguageName': u'Magyar',
		'Ferdinand Motel': u'Ferdinánd Panzió',
		'Language': u'Nyelv',
		'Date': u'Dátum',
		'Name': u'Név',
		'Please confirm your action.' : u'Kérem igazolja választását.',
		'Are you sure?' : u'Biztos benne?',
		'OK' : u'OK',

		# Admin
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
		'Cancel': u'Mégse',

		#Bookin validation
		'Specify a valid email address': u'Kérem adjon meg egy helyes email címet!',
		'Add at least one room': u'Adjon hozzá a foglaláshoz legalább egy szobát!',
		'Specify a valid full name': u'Kérem teljes és helyes nevet megadni.',
		'Invalid data! See fields above.': u'Helytelen adatok. Kérem javítsa ki az űrlapot.',
		'Specify a valid phone number': u'A megadott telefonszám helytelen.',

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
		'Find us on': u'Megtalálhatsz minket'
	}, 
	'ro' : {
		# Base
		'LanguageName': u'Română',
		'Ferdinand Motel': u'Motel Ferdinand',
		'Language': u'Limbă',
		'Date': u'Data',
		'Name': u'Nume',
		'Please confirm your action.' : u'Vă rog să confirmați acțiunea',
		'Are you sure?' : u'Sunteți sigur?',
		'OK' : u'OK',

		# Admin
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
		'Departure date': u'Data plecării',
		'Cancel': u'Anulează',

		#Bookin validation
		'Specify a valid email address': u'Secificați o adresă de email valid.',
		'Add at least one room': u'Adăugați cel puțin o cameră.',
		'Specify a valid full name': u'Introduceți un nume complet și valid.',
		'Invalid data! See fields above.': u'Date invalide! Vă rugăm verificați câmpurile.',
		'Specify a valid phone number': u'Numărul specificat este invalid.',

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
		'Find us on': u'Ne poți găsi pe'
	}
}