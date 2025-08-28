from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('cars/', views.CarListCreateView.as_view(), name='car-list'),
    path('cars/<int:pk>/', views.CarDetailView.as_view(), name='car-detail'),
    
    path('motorcycles/', views.MotorcycleListCreateView.as_view(), name='motorcycle-list'),
    path('motorcycles/<int:pk>/', views.MotorcycleDetailView.as_view(), name='motorcycle-detail'),
    
    path('search/', views.SearchView.as_view(), name='search'),
    
    path('contact-messages/', views.ContactMessageListCreateView.as_view(), name='contact-message-list'),
    path('contact-messages/<int:pk>/', views.ContactMessageDetailView.as_view(), name='contact-message-detail'),
    
    path('subscribers/', views.SubscriberListCreateView.as_view(), name='subscriber-list'),
    path('subscribers/<int:pk>/', views.SubscriberDetailView.as_view(), name='subscriber-detail'),
    path('subscribers/export/', views.export_subscribers, name='subscriber-export'),
    
    path('users/', views.UserListView.as_view(), name='user-list'),
    
    # Featured items endpoints
    path('featured/', views.FeaturedItemListCreateView.as_view(), name='featured-list'),
    path('featured/<int:pk>/', views.FeaturedItemDetailView.as_view(), name='featured-detail'),
    path('available-cars/', views.AvailableCarsListView.as_view(), name='available-cars'),
    path('available-motorcycles/', views.AvailableMotorcyclesListView.as_view(), name='available-motorcycles'),
    
    # Discount endpoints
    path('discounts/', views.DiscountListCreateView.as_view(), name='discount-list'),
    path('discounts/<int:pk>/', views.DiscountDetailView.as_view(), name='discount-detail'),
    path('available-cars-discount/', views.AvailableCarsForDiscountListView.as_view(), name='available-cars-discount'),
    path('available-motorcycles-discount/', views.AvailableMotorcyclesForDiscountListView.as_view(), name='available-motorcycles-discount'),
]