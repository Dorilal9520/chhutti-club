from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers
from .models import Destination, Package, Booking, Review


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'rating', 'comment', 'created_at')


class PackageSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Package
        fields = (
            'id', 'title', 'description', 'itinerary', 'destination',
            'price_per_person', 'duration_days', 'max_guests',
            'available_from', 'available_to', 'average_rating',
        )

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return None
        return round(sum(r.rating for r in reviews) / len(reviews), 1)


class PackageDetailSerializer(PackageSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(PackageSerializer.Meta):
        fields = PackageSerializer.Meta.fields + ('reviews',)


class BookingSerializer(serializers.ModelSerializer):
    package_title = serializers.CharField(source='package.title', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'package', 'package_title', 'start_date',
                  'guests', 'total_price', 'status', 'created_at')
        read_only_fields = ('total_price', 'status', 'created_at')

    def validate(self, data):
        package = data['package']
        start = data['start_date']
        guests = data['guests']

        if not package.is_active:
            raise serializers.ValidationError("Ye package abhi available nahi hai.")
        if start < timezone.localdate():
            raise serializers.ValidationError("Past ki date book nahi ho sakti.")
        if guests > package.max_guests:
            raise serializers.ValidationError(f"Max {package.max_guests} guests allowed hain.")
        if start < package.available_from or start > package.available_to:
            raise serializers.ValidationError("Ye date package ki availability me nahi hai.")

        left = package.seats_left(start)
        if guests > left:
            if left == 0:
                raise serializers.ValidationError("Is date pe saari seats full hain.")
            raise serializers.ValidationError(f"Is date pe sirf {left} seats bachi hain.")
        return data