from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Customize admin site
admin.site.site_header = 'Talha Abbas — Portfolio Admin'
admin.site.site_title = 'Portfolio Admin'
admin.site.index_title = 'Dashboard'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
    path('projects/', include('apps.projects.urls')),
    path('blog/', include('apps.blog.urls')),
    path('', include('apps.core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
