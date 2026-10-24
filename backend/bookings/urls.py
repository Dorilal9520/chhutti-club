from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),

    path('packages/', views.PackageListView.as_view()),
    path('packages/<int:pk>/', views.PackageDetailView.as_view()),
    path('packages/<int:pk>/seats/', views.seats_left),
    path('packages/<int:pk>/reviews/', views.ReviewCreateView.as_view()),

    path('bookings/', views.BookingListCreateView.as_view()),
    path('bookings/<int:pk>/cancel/', views.cancel_booking),
]