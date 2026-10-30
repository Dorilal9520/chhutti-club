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
    list_display = (
        'user',
        'package',
        'start_date',
        'guests',
        'total_price',
        'status',
        'payment_status',
        'payment_reference',
    )

    list_filter = ('status', 'payment_status')

    search_fields = (
        'user__username',
        'package__title',
        'payment_reference',
    )

    readonly_fields = (
        'total_price',
        'created_at',
        'payment_reference',
        'payment_status',
    )

    actions = ['verify_payment', 'reject_payment']

    @admin.action(description='Verify selected payments')
    def verify_payment(self, request, queryset):
        pending = queryset.filter(
            payment_status=Booking.PaymentStatus.SUBMITTED
        )

        count = pending.update(
            payment_status=Booking.PaymentStatus.VERIFIED,
            status=Booking.Status.CONFIRMED,
        )

        self.message_user(
            request,
            f'{count} payment(s) verified and booking(s) confirmed.'
        )

    @admin.action(description='Reject selected payments')
    def reject_payment(self, request, queryset):
        pending = queryset.filter(
            payment_status=Booking.PaymentStatus.SUBMITTED
        )

        count = pending.update(
            payment_status=Booking.PaymentStatus.REJECTED
        )

        self.message_user(
            request,
            f'{count} payment(s) rejected.'
        )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('package', 'user', 'rating')