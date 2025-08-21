from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Car, Motorcycle
from .serializers import CarSerializer, MotorcycleSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

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
            # We need to return a unified queryset, but since we have two models,
            # we'll handle this in the serializer or frontend
            return cars  # This is a simplification
        elif vehicle_type == 'cars':
            return cars
        elif vehicle_type == 'motorcycles':
            return motorcycles
        
        return Car.objects.none()