from django.conf import settings
from django.db import models
from django.db.models import Sum
from django.core.validators import MinValueValidator, MaxValueValidator


class Destination(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='destinations/', blank=True, null=True)

    def __str__(self):
        return f"{self.name}, {self.country}"


class Package(models.Model):
    image = models.ImageField(upload_to="packages/", blank=True, null=True)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='packages')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    itinerary = models.TextField(blank=True)
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField()
    max_guests = models.PositiveIntegerField(default=10)
    seats_per_date = models.PositiveIntegerField(default=20)
    available_from = models.DateField()
    available_to = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def seats_left(self, date):
        booked = (
            self.bookings.filter(start_date=date)
            .exclude(status='cancelled')
            .aggregate(total=Sum('guests'))['total'] or 0
        )
        return max(self.seats_per_date - booked, 0)

    def __str__(self):
        return self.title


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    guests = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    total_price = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total_price = self.package.price_per_person * self.guests
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user} - {self.package} ({self.status})"


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'package')

    def __str__(self):
        return f"{self.package} - {self.rating}★"