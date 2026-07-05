"""
XML sitemap definitions for talhawkk.me.

Exposes:
- Static pages (home, about, contact, projects list, blog list)
- All published Projects (case studies)
- All published BlogPosts
"""

from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from apps.projects.models import Project
from apps.blog.models import BlogPost


class StaticViewSitemap(Sitemap):
    """Top-level marketing pages — highest priority, refreshed weekly."""

    changefreq = 'weekly'
    priority = 1.0

    def items(self):
        return ['core:home', 'core:about', 'core:contact', 'projects:list', 'blog:list']

    def location(self, item):
        return reverse(item)


class ProjectSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.8

    def items(self):
        return Project.objects.all().order_by('-created_at')

    def lastmod(self, obj):
        return obj.updated_at


class BlogSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.7

    def items(self):
        return BlogPost.objects.filter(is_published=True).order_by('-published_date')

    def lastmod(self, obj):
        return obj.updated_date


# Sitemap registry — index includes these sections.
sitemaps = {
    'static': StaticViewSitemap,
    'projects': ProjectSitemap,
    'blog': BlogSitemap,
}
