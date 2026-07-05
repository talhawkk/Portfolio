from django.shortcuts import render, get_object_or_404
from .models import Project, Technology


def project_list(request):
    """All projects page with technology filtering."""
    tech_filter = request.GET.get('tech', None)
    projects = Project.objects.all()
    all_projects = Project.objects.all()

    if tech_filter:
        projects = projects.filter(technologies__slug=tech_filter)

    context = {
        'page_title': 'Projects by Talha Abbas — Django, AI & SaaS Work',
        'projects': projects,
        'technologies': Technology.objects.all(),
        'active_filter': tech_filter,
        'project_stats': {
            'total': all_projects.count(),
            'featured': all_projects.filter(is_featured=True).count(),
            'technologies': Technology.objects.count(),
        },
        'seo_title': 'Projects by Talha Abbas — Django, AI & SaaS Work',
        'seo_description': (
            'Selected projects by Talha Abbas (talhawkk): Django SaaS platforms, '
            'AI/API integrations, automation tools, and backend systems built in production.'
        ),
    }
    return render(request, 'projects/project_list.html', context)


def project_detail(request, slug):
    """Single project case study page."""
    project = get_object_or_404(Project, slug=slug)
    related_projects = Project.objects.filter(
        technologies__in=project.technologies.all()
    ).exclude(pk=project.pk).distinct()[:3]

    # SEO image: per-project OG → featured → site default (handled in template)
    seo_image_url = ''
    seo_image = project.seo_image
    if seo_image:
        seo_image_url = request.build_absolute_uri(seo_image.url)

    # Build absolute canonical URL for this project
    canonical_url = request.build_absolute_uri(project.get_absolute_url()) if hasattr(project, 'get_absolute_url') \
        else request.build_absolute_uri()

    context = {
        'page_title': f'{project.title} — Talha Abbas',
        'project': project,
        'related_projects': related_projects,
        # SEO
        'seo_title': f'{project.title} — A {project.technologies.first().name if project.technologies.first() else "Django"} Project by Talha Abbas',
        'seo_description': project.seo_description,
        'seo_image_url': seo_image_url,
        'canonical_url': canonical_url,
        'breadcrumb_items': [
            {'name': 'Home', 'url': '/'},
            {'name': 'Projects', 'url': '/projects/'},
            {'name': project.title, 'url': request.path},
        ],
        'article': {
            'headline': project.title,
            'description': project.seo_description,
            'image_url': seo_image_url or '',
            'date_published': project.created_at,
            'date_modified': project.updated_at,
            'url': canonical_url,
        },
    }
    return render(request, 'projects/project_detail.html', context)
