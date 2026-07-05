from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

from .models import SiteConfiguration, Skill, Experience, Education, ContactSubmission, Certification
from apps.projects.models import Project
from apps.blog.models import BlogPost


SKILL_CATEGORY_META = {
    'frontend': {
        'accent': '#2dd4bf',
        'accent_rgb': '45, 212, 191',
        'summary': 'Interfaces that feel sharp, fast, accessible, and built for real users.',
    },
    'backend': {
        'accent': '#38bdf8',
        'accent_rgb': '56, 189, 248',
        'summary': 'APIs, business logic, integrations, and scalable application foundations.',
    },
    'database': {
        'accent': '#facc15',
        'accent_rgb': '250, 204, 21',
        'summary': 'Data modeling, querying, persistence, and performance-minded storage.',
    },
    'devops': {
        'accent': '#fb7185',
        'accent_rgb': '251, 113, 133',
        'summary': 'Deployment workflows, cloud operations, automation, and delivery discipline.',
    },
    'ml': {
        'accent': '#a78bfa',
        'accent_rgb': '167, 139, 250',
        'summary': 'AI systems, retrieval flows, model integration, and intelligent automation.',
    },
    'tools': {
        'accent': '#34d399',
        'accent_rgb': '52, 211, 153',
        'summary': 'Developer tooling, collaboration systems, and workflow accelerators.',
    },
}


def _skill_level_label(proficiency):
    if proficiency >= 90:
        return 'Expert'
    if proficiency >= 80:
        return 'Advanced'
    if proficiency >= 65:
        return 'Strong'
    return 'Working'


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
        # SEO
        'seo_title': f'{config.full_name} — Python/Django Developer & AI Integrator',
    }
    return render(request, 'core/home.html', context)


def about(request):
    """About page — extended bio, full skills, experience, education."""
    config = SiteConfiguration.load()
    all_skills = list(Skill.objects.all())
    skills_groups = []
    skills_by_category = {}

    for category_key, category_label in Skill.CATEGORY_CHOICES:
        category_skills = [skill for skill in all_skills if skill.category == category_key]
        if not category_skills:
            continue

        for skill in category_skills:
            skill.level_label = _skill_level_label(skill.proficiency)

        average = round(sum(skill.proficiency for skill in category_skills) / len(category_skills))
        meta = SKILL_CATEGORY_META.get(category_key, SKILL_CATEGORY_META['tools'])
        group = {
            'slug': category_key,
            'label': category_label,
            'skills': category_skills,
            'count': len(category_skills),
            'average': average,
            'level_label': _skill_level_label(average),
            'summary': meta['summary'],
            'accent': meta['accent'],
            'accent_rgb': meta['accent_rgb'],
        }
        skills_groups.append(group)
        skills_by_category[category_label] = category_skills

    skills_summary = {
        'total': len(all_skills),
        'categories': len(skills_groups),
        'average': round(sum(skill.proficiency for skill in all_skills) / len(all_skills)) if all_skills else 0,
    }

    context = {
        'page_title': f'About — {config.full_name}',
        'skills_by_category': skills_by_category,
        'skills_groups': skills_groups,
        'skills_summary': skills_summary,
        'experiences': Experience.objects.all(),
        'education': Education.objects.all(),
        'certifications': Certification.objects.all(),
        # SEO
        'seo_title': f'About {config.full_name} Ali — Python/Django Developer in Pakistan',
    }

    return render(request, 'core/about.html', context)


def contact(request):
    """Contact page with form."""
    config = SiteConfiguration.load()
    context = {
        'page_title': f'Contact — {config.full_name}',
        # SEO
        'seo_title': f'Contact {config.full_name} — Hire Python/Django Developer',
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
