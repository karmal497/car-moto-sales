from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('vehicles.urls')),
]

# ¡IMPORTANTE! Quita el if settings.DEBUG:
# Sirve archivos media en desarrollo Y producción
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# OPCIONAL: Para producción también puedes usar esta alternativa:
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# else:
#     urlpatterns += [
#         re_path(r'^media/(?P<path>.*)$', serve, {
#             'document_root': settings.MEDIA_ROOT,
#         }),
#     ]