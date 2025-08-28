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

class FeaturedItem(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('car', 'Auto'),
        ('motorcycle', 'Moto'),
    ]
    
    car = models.ForeignKey(Car, on_delete=models.CASCADE, null=True, blank=True)
    motorcycle = models.ForeignKey(Motorcycle, on_delete=models.CASCADE, null=True, blank=True)
    vehicle_type = models.CharField(max_length=10, choices=VEHICLE_TYPE_CHOICES)
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['car', 'motorcycle']
        ordering = ['-created_at']
    
    def __str__(self):
        if self.vehicle_type == 'car' and self.car:
            return f"Destacado: {self.car.title}"
        elif self.vehicle_type == 'motorcycle' and self.motorcycle:
            return f"Destacado: {self.motorcycle.title}"
        return "Destacado sin vehículo"

class Discount(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, null=True, blank=True)
    motorcycle = models.ForeignKey(Motorcycle, on_delete=models.CASCADE, null=True, blank=True)
    vehicle_type = models.CharField(max_length=10, choices=FeaturedItem.VEHICLE_TYPE_CHOICES)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        vehicle_name = ""
        if self.vehicle_type == 'car' and self.car:
            vehicle_name = self.car.title
        elif self.vehicle_type == 'motorcycle' and self.motorcycle:
            vehicle_name = self.motorcycle.title
        
        return f"Descuento {self.discount_percentage}% - {vehicle_name}"

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