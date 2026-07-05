from django.shortcuts import render, get_object_or_404
from .models import BlogPost, Category


def blog_list(request):
    """Blog listing page with category filtering."""
    category_filter = request.GET.get('category', None)
    posts = BlogPost.objects.filter(is_published=True)

    if category_filter:
        posts = posts.filter(category__slug=category_filter)

    context = {
        'page_title': 'Blog — Talha Abbas',
        'posts': posts,
        'categories': Category.objects.all(),
        'active_category': category_filter,
        'blog_stats': {
            'posts': BlogPost.objects.filter(is_published=True).count(),
            'categories': Category.objects.count(),
            'featured': BlogPost.objects.filter(is_published=True, is_featured=True).count(),
        },
        'seo_title': 'Blog — Talha Abbas · Django, Python & AI Notes',
        'seo_description': (
            'Notes and write-ups by Talha Abbas (talhawkk) on Django, Python, '
            'REST APIs, AI integrations, and building software that ships.'
        ),
    }
    return render(request, 'blog/blog_list.html', context)


def blog_detail(request, slug):
    """Single blog post page."""
    post = get_object_or_404(BlogPost, slug=slug, is_published=True)
    related_posts = BlogPost.objects.filter(
        is_published=True, category=post.category
    ).exclude(pk=post.pk)[:3]

    canonical_url = request.build_absolute_uri(post.get_absolute_url()) if hasattr(post, 'get_absolute_url') \
        else request.build_absolute_uri()

    # SEO image: per-post OG → featured → site default (handled in template)
    seo_image_url = ''
    seo_image = post.seo_image
    if seo_image:
        seo_image_url = request.build_absolute_uri(seo_image.url)

    context = {
        'page_title': f'{post.title} — Talha Abbas',
        'post': post,
        'related_posts': related_posts,
        # SEO
        'seo_title': f'{post.title} — Talha Abbas',
        'seo_description': post.seo_description,
        'seo_image_url': seo_image_url,
        'canonical_url': canonical_url,
        'breadcrumb_items': [
            {'name': 'Home', 'url': '/'},
            {'name': 'Blog', 'url': '/blog/'},
            {'name': post.title, 'url': request.path},
        ],
        'article': {
            'headline': post.title,
            'description': post.seo_description,
            'image_url': seo_image_url or '',
            'date_published': post.published_date,
            'date_modified': post.updated_date,
            'url': canonical_url,
        },
    }
    return render(request, 'blog/blog_detail.html', context)
