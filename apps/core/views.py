from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

from .models import SiteConfiguration, Skill, Experience, Education, ContactSubmission, Certification
from apps.projects.models import Project
from apps.blog.models import BlogPost


def home(request):
    """Landing page — hero, about preview, skills, featured projects, experience, blog preview."""
    config = SiteConfiguration.load()
    context = {
        'page_title': f'{config.full_name} — {config.title}',
        'skills': Skill.objects.filter(is_featured=True),
        'featured_projects': Project.objects.filter(is_featured=True)[:3],
        'experiences': Experience.objects.all()[:5],
        'education': Education.objects.all(),
        'blog_posts': BlogPost.objects.filter(is_published=True)[:3],
    }
    return render(request, 'core/home.html', context)


def about(request):
    """About page — extended bio, full skills, experience, education."""
    config = SiteConfiguration.load()
    context = {
        'page_title': f'About — {config.full_name}',
        'skills_by_category': {},
        'experiences': Experience.objects.all(),
        'education': Education.objects.all(),
        'certifications': Certification.objects.all(),
    }
    # Group skills by category
    for skill in Skill.objects.all():
        cat = skill.get_category_display()
        if cat not in context['skills_by_category']:
            context['skills_by_category'][cat] = []
        context['skills_by_category'][cat].append(skill)

    return render(request, 'core/about.html', context)


def contact(request):
    """Contact page with form."""
    config = SiteConfiguration.load()
    context = {
        'page_title': f'Contact — {config.full_name}',
    }

    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        subject = request.POST.get('subject', '').strip()
        message_text = request.POST.get('message', '').strip()

        if all([name, email, subject, message_text]):
            ContactSubmission.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message_text,
            )
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': True, 'message': 'Message sent successfully!'})
            messages.success(request, 'Message sent successfully!')
            return redirect('core:contact')
        else:
            error = 'All fields are required.'
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': error}, status=400)
            messages.error(request, error)

    return render(request, 'core/contact.html', context)
