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
    type = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FeaturedItem
        fields = ['id', 'car', 'motorcycle', 'vehicle_type', 'created_at', 'title', 'image_url', 'price', 'type']
    
    def get_type(self, obj):
        return 'Auto' if obj.vehicle_type == 'car' else 'Moto'
    
    def get_image_url(self, obj):
        if obj.image_url:
            request = self.context.get('request')
            if request:
                # Construir URL absoluta usando el path relativo almacenado
                return request.build_absolute_uri('/media/' + obj.image_url)
            return '/media/' + obj.image_url
        return None

class DiscountSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    new_price = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Discount
        fields = ['id', 'car', 'motorcycle', 'vehicle_type', 'discount_percentage', 
                 'start_date', 'end_date', 'created_at', 'is_active', 'title', 
                 'image_url', 'original_price', 'new_price', 'type']
    
    def get_type(self, obj):
        return 'Auto' if obj.vehicle_type == 'car' else 'Moto'
    
    def get_new_price(self, obj):
        if obj.original_price:
            discount_decimal = float(obj.discount_percentage) / 100
            return float(obj.original_price) * (1 - discount_decimal)
        return None
    
    def get_image_url(self, obj):
        if obj.image_url:
            request = self.context.get('request')
            if request:
                # Construir URL absoluta usando el path relativo almacenado
                return request.build_absolute_uri('/media/' + obj.image_url)
            return '/media/' + obj.image_url
        return None

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