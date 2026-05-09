from .models import SiteConfiguration


def site_context(request):
    """Make site configuration available in all templates."""
    return {
        'site_config': SiteConfiguration.load(),
    }
