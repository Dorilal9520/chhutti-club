from datetime import timedelta
from django.utils import timezone
from bookings.models import Destination, Package

today = timezone.localdate()
end = today + timedelta(days=120)

DATA = [
    {
        'name': 'Goa', 'country': 'India',
        'description': 'Beaches, cafes aur nightlife ke liye mashhoor.',
        'packages': [
            {
                'title': 'Goa Beach Escape',
                'description': 'Samundar kinare 5 din ka aaramdayak holiday, family aur couples dono ke liye.',
                'itinerary': 'Day 1: Pahunchna, hotel check-in, Baga beach ki shaam\nDay 2: North Goa beaches aur Fort Aguada\nDay 3: Water sports aur sunset cruise\nDay 4: South Goa, churches aur local market\nDay 5: Breakfast ke baad wapsi',
                'price': 14500, 'days': 5, 'max_guests': 8, 'seats': 20,
            },
            {
                'title': 'Goa Weekend Party Trip',
                'description': 'Dosto ke saath 3 din ki masti, beach parties aur street food.',
                'itinerary': 'Day 1: Pahunchna aur Calangute beach\nDay 2: Anjuna flea market aur beach party\nDay 3: Check-out aur wapsi',
                'price': 9500, 'days': 3, 'max_guests': 10, 'seats': 25,
            },
        ],
    },
    {
        'name': 'Manali', 'country': 'India',
        'description': 'Himachal ki pahadiyon me baraf, adventure aur sukoon.',
        'packages': [
            {
                'title': 'Manali Snow Trail',
                'description': 'Baraf se dhake pahad, Solang Valley aur Rohtang ka safar.',
                'itinerary': 'Day 1: Pahunchna aur Mall Road\nDay 2: Solang Valley, snow activities\nDay 3: Atal Tunnel aur Sissu\nDay 4: Check-out aur wapsi',
                'price': 11200, 'days': 4, 'max_guests': 12, 'seats': 20,
            },
            {
                'title': 'Manali Adventure Week',
                'description': 'Ek hafte ka adventure: paragliding, rafting aur trekking.',
                'itinerary': 'Day 1: Pahunchna\nDay 2: Paragliding at Solang\nDay 3: River rafting at Kullu\nDay 4: Hadimba Temple aur Old Manali\nDay 5: Jogini Falls trek\nDay 6: Free day, shopping\nDay 7: Wapsi',
                'price': 16800, 'days': 6, 'max_guests': 8, 'seats': 15,
            },
        ],
    },
    {
        'name': 'Jaipur', 'country': 'India',
        'description': 'Pink City, jahan har mod par kila ya mahal milta hai.',
        'packages': [
            {
                'title': 'Jaipur Royal Heritage Tour',
                'description': 'Kile, mahal aur Rajasthani khana, 3 din me poora Jaipur.',
                'itinerary': 'Day 1: Amber Fort aur Jal Mahal\nDay 2: City Palace, Hawa Mahal, Jantar Mantar\nDay 3: Bapu Bazaar shopping aur wapsi',
                'price': 9800, 'days': 3, 'max_guests': 10, 'seats': 25,
            },
        ],
    },
    {
        'name': 'Rishikesh', 'country': 'India',
        'description': 'Ganga kinare yoga, rafting aur adhyatm ki nagri.',
        'packages': [
            {
                'title': 'Rishikesh Rafting and Yoga',
                'description': 'Subah yoga, dopahar rafting, shaam ko Ganga aarti.',
                'itinerary': 'Day 1: Pahunchna aur Ganga aarti\nDay 2: Morning yoga aur river rafting\nDay 3: Laxman Jhula, cafes aur wapsi',
                'price': 7500, 'days': 3, 'max_guests': 12, 'seats': 20,
            },
        ],
    },
    {
        'name': 'Udaipur', 'country': 'India',
        'description': 'Jheelon aur mahalon ka shehar.',
        'packages': [
            {
                'title': 'Udaipur Lakes and Palaces',
                'description': 'Pichola jheel par boat ride aur City Palace ki shaan.',
                'itinerary': 'Day 1: Pahunchna aur Fateh Sagar sunset\nDay 2: City Palace aur Lake Pichola boat ride\nDay 3: Sajjangarh aur Saheliyon ki Bari\nDay 4: Check-out aur wapsi',
                'price': 13200, 'days': 4, 'max_guests': 8, 'seats': 15,
            },
        ],
    },
    {
        'name': 'Munnar', 'country': 'India',
        'description': 'Kerala ke chai ke baagan aur dhundh bhari pahadiyan.',
        'packages': [
            {
                'title': 'Munnar Tea Hills Retreat',
                'description': 'Chai ke baagano ke beech shaant 4 din.',
                'itinerary': 'Day 1: Pahunchna aur tea garden walk\nDay 2: Eravikulam National Park\nDay 3: Mattupetty Dam aur Echo Point\nDay 4: Tea museum aur wapsi',
                'price': 12400, 'days': 4, 'max_guests': 10, 'seats': 18,
            },
        ],
    },
    {
        'name': 'Richi', 'country': 'INDIA',
        'description': 'Best place in the world.',
        'packages': [
            {
                'title': 'Richi Family Retreat',
                'description': 'Family ke saath 2 din ka aaramdayak ghoomna.',
                'itinerary': 'Day 1: Pahunchna aur local sightseeing\nDay 2: Breakfast ke baad wapsi',
                'price': 6800, 'days': 2, 'max_guests': 12, 'seats': 25,
            },
        ],
    },
]

for d in DATA:
    destination, _ = Destination.objects.get_or_create(
        name=d['name'],
        defaults={'country': d['country'], 'description': d['description']},
    )
    for p in d['packages']:
        Package.objects.get_or_create(
            title=p['title'],
            defaults={
                'destination': destination,
                'description': p['description'],
                'itinerary': p['itinerary'],
                'price_per_person': p['price'],
                'duration_days': p['days'],
                'max_guests': p['max_guests'],
                'seats_per_date': p['seats'],
                'available_from': today,
                'available_to': end,
                'is_active': True,
            },
        )

print('Done:', Destination.objects.count(), 'destinations,', Package.objects.count(), 'packages')