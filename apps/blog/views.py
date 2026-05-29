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
    }
    return render(request, 'blog/blog_list.html', context)


def blog_detail(request, slug):
    """Single blog post page."""
    post = get_object_or_404(BlogPost, slug=slug, is_published=True)
    related_posts = BlogPost.objects.filter(
        is_published=True, category=post.category
    ).exclude(pk=post.pk)[:3]

    context = {
        'page_title': f'{post.title} — Talha Abbas',
        'post': post,
        'related_posts': related_posts,
    }
    return render(request, 'blog/blog_detail.html', context)
