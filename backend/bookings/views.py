from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError

from .models import Package, Booking, Review
from .serializers import (
    PackageSerializer, PackageDetailSerializer, RegisterSerializer,
    BookingSerializer, ReviewSerializer,
)

class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        package = get_object_or_404(Package, pk=self.kwargs['pk'], is_active=True)
        user = self.request.user

        has_booking = (
            Booking.objects.filter(user=user, package=package)
            .exclude(status=Booking.Status.CANCELLED)
            .exists()
        )
        if not has_booking:
            raise PermissionDenied('Only guests who booked this package can review it.')

        if Review.objects.filter(user=user, package=package).exists():
            raise ValidationError('You have already reviewed this package.')

        serializer.save(user=user, package=package)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class PackageListView(generics.ListAPIView):
    serializer_class = PackageSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = (
            Package.objects.filter(is_active=True)
            .select_related('destination')
            .prefetch_related('reviews')
        )
        params = self.request.query_params

        search = params.get('search')
        if search:
            qs = qs.filter(
                Q(title__icontains=search) | Q(destination__name__icontains=search)
            )
        if params.get('min_price'):
            qs = qs.filter(price_per_person__gte=params['min_price'])
        if params.get('max_price'):
            qs = qs.filter(price_per_person__lte=params['max_price'])
        return qs


class PackageDetailView(generics.RetrieveAPIView):
    queryset = Package.objects.filter(is_active=True)
    serializer_class = PackageDetailSerializer
    permission_classes = [permissions.AllowAny]


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects.filter(user=self.request.user)
            .select_related('package')
            .order_by('-created_at')
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def cancel_booking(request, pk):
    booking = get_object_or_404(Booking, pk=pk, user=request.user)
    if booking.status == Booking.Status.CANCELLED:
        return Response(
            {'detail': 'This booking is already cancelled.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    booking.status = Booking.Status.CANCELLED
    booking.save()
    return Response(BookingSerializer(booking).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def seats_left(request, pk):
    package = get_object_or_404(Package, pk=pk, is_active=True)
    try:
        date = parse_date(request.query_params.get('date', ''))
    except ValueError:
        date = None
    if not date:
        return Response(
            {'detail': 'Send a valid date as YYYY-MM-DD.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return Response({'seats_left': package.seats_left(date)})


    