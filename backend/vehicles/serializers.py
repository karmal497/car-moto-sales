from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Car, Motorcycle, ContactMessage, Subscriber, FeaturedItem, Discount

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']
        read_only_fields = ['date_joined']

class CarSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Car
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class MotorcycleSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Motorcycle
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class FeaturedItemSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    motorcycle = MotorcycleSerializer(read_only=True)
    title = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    
    class Meta:
        model = FeaturedItem
        fields = ['id', 'car', 'motorcycle', 'vehicle_type', 'created_at', 'title', 'image_url', 'price', 'type']
    
    def get_title(self, obj):
        if obj.vehicle_type == 'car' and obj.car:
            return f"{obj.car.brand} {obj.car.model} ({obj.car.year})"
        elif obj.vehicle_type == 'motorcycle' and obj.motorcycle:
            return f"{obj.motorcycle.brand} {obj.motorcycle.model} ({obj.motorcycle.year})"
        return 'Sin título'
    
    def get_image_url(self, obj):
        if obj.vehicle_type == 'car' and obj.car and obj.car.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.car.image.url)
            return obj.car.image.url
        elif obj.vehicle_type == 'motorcycle' and obj.motorcycle and obj.motorcycle.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.motorcycle.image.url)
            return obj.motorcycle.image.url
        return None
    
    def get_price(self, obj):
        if obj.vehicle_type == 'car' and obj.car:
            return obj.car.price
        elif obj.vehicle_type == 'motorcycle' and obj.motorcycle:
            return obj.motorcycle.price
        return None
    
    def get_type(self, obj):
        if obj.vehicle_type == 'car':
            return 'Auto'
        elif obj.vehicle_type == 'motorcycle':
            return 'Moto'
        return 'Desconocido'

class DiscountSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    motorcycle = MotorcycleSerializer(read_only=True)
    title = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    original_price = serializers.SerializerMethodField()
    new_price = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    
    class Meta:
        model = Discount
        fields = ['id', 'car', 'motorcycle', 'vehicle_type', 'discount_percentage', 
                 'start_date', 'end_date', 'created_at', 'is_active', 'title', 
                 'image_url', 'original_price', 'new_price', 'type']
    
    def get_title(self, obj):
        if obj.vehicle_type == 'car' and obj.car:
            return obj.car.title
        elif obj.vehicle_type == 'motorcycle' and obj.motorcycle:
            return obj.motorcycle.title
        return ''
    
    def get_image_url(self, obj):
        if obj.vehicle_type == 'car' and obj.car and obj.car.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.car.image.url)
            return obj.car.image.url
        elif obj.vehicle_type == 'motorcycle' and obj.motorcycle and obj.motorcycle.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.motorcycle.image.url)
            return obj.motorcycle.image.url
        return None
    
    def get_original_price(self, obj):
        if obj.vehicle_type == 'car' and obj.car:
            return float(obj.car.price)
        elif obj.vehicle_type == 'motorcycle' and obj.motorcycle:
            return float(obj.motorcycle.price)
        return None
    
    def get_new_price(self, obj):
        original_price = self.get_original_price(obj)
        if original_price:
            discount_decimal = float(obj.discount_percentage) / 100
            return original_price * (1 - discount_decimal)
        return None
    
    def get_type(self, obj):
        return 'Auto' if obj.vehicle_type == 'car' else 'Moto'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['date', 'is_read']

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = '__all__'
        read_only_fields = ['subscription_date']