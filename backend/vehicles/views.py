from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Car, Motorcycle, ContactMessage, Subscriber, FeaturedItem, Discount
from .serializers import (
    CarSerializer, 
    MotorcycleSerializer, 
    UserSerializer, 
    ContactMessageSerializer,
    SubscriberSerializer,
    FeaturedItemSerializer,
    DiscountSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
import csv
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_subscribers(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="suscriptores.csv"'
    
    subscribers = Subscriber.objects.all().order_by('-subscription_date')
    
    writer = csv.writer(response)
    writer.writerow(['Email', 'Fecha de Suscripción', 'Estado'])
    
    for subscriber in subscribers:
        writer.writerow([
            subscriber.email,
            subscriber.subscription_date.strftime('%Y-%m-%d %H:%M'),
            'Activo' if subscriber.is_active else 'Inactivo'
        ])
    
    return response

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=request.data.get('password')
        )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class CarListCreateView(generics.ListCreateAPIView):
    queryset = Car.objects.all().order_by('-created_at')
    serializer_class = CarSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class MotorcycleListCreateView(generics.ListCreateAPIView):
    queryset = Motorcycle.objects.all().order_by('-created_at')
    serializer_class = MotorcycleSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class MotorcycleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Motorcycle.objects.all()
    serializer_class = MotorcycleSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class SearchView(generics.ListAPIView):
    serializer_class = CarSerializer
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        vehicle_type = self.request.query_params.get('type', 'all')
        
        if vehicle_type == 'cars' or vehicle_type == 'all':
            cars = Car.objects.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(brand__icontains=query) |
                Q(model__icontains=query)
            )
        
        if vehicle_type == 'motorcycles' or vehicle_type == 'all':
            motorcycles = Motorcycle.objects.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(brand__icontains=query) |
                Q(model__icontains=query)
            )
        
        if vehicle_type == 'all':
            return cars
        elif vehicle_type == 'cars':
            return cars
        elif vehicle_type == 'motorcycles':
            return motorcycles
        
        return Car.objects.none()

class ContactMessageListCreateView(generics.ListCreateAPIView):
    queryset = ContactMessage.objects.all().order_by('-date')
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class ContactMessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubscriberListCreateView(generics.ListCreateAPIView):
    queryset = Subscriber.objects.all().order_by('-subscription_date')
    serializer_class = SubscriberSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class SubscriberDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

# Featured Items Views
class FeaturedItemListCreateView(generics.ListCreateAPIView):
    queryset = FeaturedItem.objects.all().order_by('-created_at')
    serializer_class = FeaturedItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class FeaturedItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FeaturedItem.objects.all()
    serializer_class = FeaturedItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class AvailableCarsListView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        # Excluir autos que ya están destacados
        featured_car_ids = FeaturedItem.objects.filter(
            vehicle_type='car'
        ).exclude(car__isnull=True).values_list('car_id', flat=True)
        
        return Car.objects.exclude(id__in=featured_car_ids).order_by('-created_at')

class AvailableMotorcyclesListView(generics.ListAPIView):
    serializer_class = MotorcycleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        # Excluir motos que ya están destacadas
        featured_motorcycle_ids = FeaturedItem.objects.filter(
            vehicle_type='motorcycle'
        ).exclude(motorcycle__isnull=True).values_list('motorcycle_id', flat=True)
        
        return Motorcycle.objects.exclude(id__in=featured_motorcycle_ids).order_by('-created_at')

# Discount Views
class DiscountListCreateView(generics.ListCreateAPIView):
    queryset = Discount.objects.all().order_by('-created_at')
    serializer_class = DiscountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class DiscountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class AvailableCarsForDiscountListView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        # Excluir autos que ya tienen descuento activo
        discounted_car_ids = Discount.objects.filter(
            vehicle_type='car',
            is_active=True
        ).exclude(car__isnull=True).values_list('car_id', flat=True)
        
        return Car.objects.exclude(id__in=discounted_car_ids).order_by('-created_at')

class AvailableMotorcyclesForDiscountListView(generics.ListAPIView):
    serializer_class = MotorcycleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        # Excluir motos que ya tienen descuento activo
        discounted_motorcycle_ids = Discount.objects.filter(
            vehicle_type='motorcycle',
            is_active=True
        ).exclude(motorcycle__isnull=True).values_list('motorcycle_id', flat=True)
        
        return Motorcycle.objects.exclude(id__in=discounted_motorcycle_ids).order_by('-created_at')