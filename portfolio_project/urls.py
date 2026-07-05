from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from django.views.generic import TemplateView
from decouple import config

from portfolio_project.sitemaps import StaticViewSitemap, ProjectSitemap, BlogSitemap

# Customize admin site
admin.site.site_header = config('ADMIN_SITE_HEADER', default='Talha Abbas — Portfolio Admin')
admin.site.site_title = config('ADMIN_SITE_TITLE', default='Portfolio Admin')
admin.site.index_title = 'Dashboard'

sitemaps = {
    'static': StaticViewSitemap,
    'projects': ProjectSitemap,
    'blog': BlogSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
    path('projects/', include('apps.projects.urls')),
    path('blog/', include('apps.blog.urls')),
    path('', include('apps.core.urls')),

    # --- SEO routes ---
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
    path(
        'robots.txt',
        TemplateView.as_view(template_name='robots.txt', content_type='text/plain'),
        name='robots',
    ),
    path(
        'manifest.json',
        TemplateView.as_view(template_name='manifest.json', content_type='application/manifest+json'),
        name='manifest',
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
