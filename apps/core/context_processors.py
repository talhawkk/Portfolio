from django.conf import settings

from .models import SiteConfiguration


def site_context(request):
    """Make site configuration and SEO globals available in all templates."""
    site_config = SiteConfiguration.load()

    # Build the canonical URL for the current request:
    # absolute URL, query string stripped, forced to the canonical scheme/host.
    canonical_url = ''
    if getattr(request, 'path', None):
        canonical_url = request.build_absolute_uri(request.path)
        canonical_url = canonical_url.split('?')[0].split('#')[0]

    return {
        'site_config': site_config,
        'SITE_URL': getattr(settings, 'SITE_URL', 'https://talhawkk.me'),
        'SITE_NAME': getattr(settings, 'SITE_NAME', 'Talha Abbas'),
        'canonical_url': canonical_url,
    }
