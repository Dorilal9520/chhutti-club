from django.contrib import admin
from .models import Destination, Package, Booking, Review


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    search_fields = ('name', 'country')

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'price_per_person', 'duration_days', 'seats_per_date', 'is_active')
    list_filter = ('destination', 'is_active')
    search_fields = ('title',)
    fields = (
        'destination',
        'title',
        'image',
        'description',
        'itinerary',
        'price_per_person',
        'duration_days',
        'max_guests',
        'seats_per_date',
        'available_from',
        'available_to',
        'is_active',
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'package', 'start_date', 'guests', 'total_price', 'status')
    list_filter = ('status',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('package', 'user', 'rating')