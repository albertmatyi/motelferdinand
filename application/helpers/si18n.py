# -*- coding: utf-8 -*-

from flask import request

def get_lang_id():
	lang_id = request.cookies.get('lang_id')
	if not lang_id:
		lang_id = 'en'
	return lang_id

def translate(what):
	lang_id = get_lang_id()
	if lang_id in translations and what in translations[lang_id]:
		return translations[lang_id][what]
	return 'translations.'+str(lang_id)+'.'+str(what)
	pass

translations = {
	'en' : {
		# Base

		'Ferdinand Motel': u'Ferdinand Motel',
		'Language': u'Language',

		# Booking
		'Book': u'Book',
		'Beds': u'Beds',
		'Price per night' : u'Price',
		'$': u'RON',
		'Greeting': u'Preparing coffee',
		'Full Name': u'Full Name',
		'Email': u'Email',
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

		#Forms
		'Save': u'Save',
		'Edit category': u'Edit category',
		'Edit content': u'Edit content',
		'Edit bookable': u'Edit bookable',
		'Description': u'Description',
		'Title': u'Title'
	},
	'hu' : {
		# Base
		'Ferdinand Motel': u'Ferdinánd Panzió',
		'Language': u'Nyelv',

		# Booking
		'Book': u'Foglalás',
		'Beds': u'Ágyak száma',
		'Price per night' : u'Ár/északa',
		'$': u'HUF',
		'Greeting': u'Készül a kávé',
		'Full Name': u'Teljes név',
		'Email': u'Email',
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

		#Forms
		'Save': u'Mentés',
		'Edit category': u'Kategória módosítás',
		'Edit content': u'Tartalom módosítás',
		'Edit bookable': u'Apartman módosítás',
		'Description': u'Leírás',
		'Title': u'Cím'
	}, 
	'ro' : {
		# Base

		'Ferdinand Motel': u'Motel Ferdinand',
		'Language': u'Limbă',

		# Booking
		'Book': u'Rezervă',
		'Beds': u'Paturi',
		'Price per night' : u'Preț',
		'$': u'RON',
		'Greeting': u'Se prepară cafeaua',
		'Full Name': u'Nume complet',
		'Email': u'Email',
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

		#Forms
		'Save': u'Salvează',
		'Edit category': u'Modifică categoria',
		'Edit content': u'Modifică conținut',
		'Edit bookable': u'Modifică cameră',
		'Description': u'Descriere',
		'Title': u'Titlu'
	}
}