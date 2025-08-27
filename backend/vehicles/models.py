from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Car(models.Model):
    TRANSMISSION_CHOICES = [
        ('manual', 'Mecánico'),
        ('automatic', 'Automático'),
        ('electric', 'Eléctrico'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    color = models.CharField(max_length=50)
    engine = models.CharField(max_length=100)
    transmission = models.CharField(max_length=10, choices=TRANSMISSION_CHOICES)
    mileage = models.IntegerField()
    fuel_type = models.CharField(max_length=50)
    image = models.ImageField(upload_to='cars/')
    created_at = models.DateTimeField(default=timezone.now)
    is_sold = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

class Motorcycle(models.Model):
    CATEGORY_CHOICES = [
        ('combustion', 'Combustión'),
        ('electric', 'Eléctrico'),
        ('automatic', 'Automática'),
        ('semi_automatic', 'Semiautomática'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    color = models.CharField(max_length=50)
    engine = models.CharField(max_length=100)
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES)
    mileage = models.IntegerField()
    fuel_type = models.CharField(max_length=50)
    image = models.ImageField(upload_to='motorcycles/')
    created_at = models.DateTimeField(default=timezone.now)
    is_sold = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Mensaje de {self.name} - {self.date.strftime('%Y-%m-%d')}"

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    subscription_date = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.email