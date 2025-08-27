from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Car, Motorcycle, ContactMessage, Subscriber
from .serializers import (
    CarSerializer, 
    MotorcycleSerializer, 
    UserSerializer, 
    ContactMessageSerializer,
    SubscriberSerializer
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
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

class MotorcycleListCreateView(generics.ListCreateAPIView):
    queryset = Motorcycle.objects.all().order_by('-created_at')
    serializer_class = MotorcycleSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class MotorcycleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Motorcycle.objects.all()
    serializer_class = MotorcycleSerializer

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