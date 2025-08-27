from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Car, Motorcycle, ContactMessage, Subscriber

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
            return obj.image.url
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