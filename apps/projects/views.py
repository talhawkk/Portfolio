from django.shortcuts import render, get_object_or_404
from .models import Project, Technology


def project_list(request):
    """All projects page with technology filtering."""
    tech_filter = request.GET.get('tech', None)
    projects = Project.objects.all()

    if tech_filter:
        projects = projects.filter(technologies__slug=tech_filter)

    context = {
        'page_title': 'Projects — Talha Abbas',
        'projects': projects,
        'technologies': Technology.objects.all(),
        'active_filter': tech_filter,
    }
    return render(request, 'projects/project_list.html', context)


def project_detail(request, slug):
    """Single project case study page."""
    project = get_object_or_404(Project, slug=slug)
    related_projects = Project.objects.filter(
        technologies__in=project.technologies.all()
    ).exclude(pk=project.pk).distinct()[:3]

    context = {
        'page_title': f'{project.title} — Talha Abbas',
        'project': project,
        'related_projects': related_projects,
    }
    return render(request, 'projects/project_detail.html', context)
