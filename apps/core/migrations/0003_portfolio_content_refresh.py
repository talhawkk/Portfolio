from datetime import date

from django.db import migrations


def refresh_portfolio_content(apps, schema_editor):
    SiteConfiguration = apps.get_model('core', 'SiteConfiguration')
    Skill = apps.get_model('core', 'Skill')
    Experience = apps.get_model('core', 'Experience')
    Education = apps.get_model('core', 'Education')
    Project = apps.get_model('projects', 'Project')
    Technology = apps.get_model('projects', 'Technology')

    cfg, _ = SiteConfiguration.objects.get_or_create(pk=1)
    cfg.full_name = cfg.full_name or 'Talha Abbas'
    cfg.title = 'Python/Django Developer | Final-Year CS Student'
    cfg.tagline = 'Python/Django developer building practical web apps and AI integrations.'
    cfg.subtitle = 'Final-year BS Computer Science student focused on Django, Flask, REST APIs, AI/API integrations, data handling, and cloud deployment.'
    cfg.bio = 'Final-year BS Computer Science student working mainly with Python, Django, Flask, REST APIs, data workflows, and AI/API integrations.'
    cfg.detailed_bio = (
        'I am a final-year BS Computer Science student focused on Python web development. '
        'My strongest work is around Django and Flask applications, REST APIs, admin workflows, '
        'PostgreSQL and Redis backed features, and practical AI/API integrations.\n\n'
        'I have built real project and client-style systems where the work goes beyond a landing page: '
        'authentication, dashboards, payment or activation flows, Telegram/API integrations, background services, '
        'deployment setup, and data handling. I am still early in my career, but I care about writing understandable code, '
        'structuring projects cleanly, and making the product usable for the people who depend on it.\n\n'
        'I am looking for internships, junior Python/Django roles, backend or full-stack opportunities, '
        'AI integration work, and cloud-based web app projects where I can keep learning while contributing useful engineering work.'
    )
    cfg.meta_description = 'Talha Abbas is a final-year BS Computer Science student and Python/Django developer building web apps, REST APIs, AI integrations, and cloud-deployed backend systems.'
    cfg.meta_keywords = 'Talha Abbas, Python developer, Django developer, Flask, REST APIs, AI integration, backend developer, final year computer science student'
    cfg.years_experience = 1
    cfg.projects_completed = 8
    cfg.technologies_used = 15
    cfg.save()

    skill_data = [
        ('Python', 'backend', 84, 'PY', True),
        ('Django', 'backend', 82, 'DJ', True),
        ('Django REST Framework', 'backend', 76, 'DRF', True),
        ('Flask', 'backend', 72, 'FL', True),
        ('HTML/CSS/JavaScript', 'frontend', 74, 'UI', True),
        ('PostgreSQL', 'database', 72, 'PG', True),
        ('Redis', 'database', 70, 'RD', True),
        ('OpenAI APIs / RAG', 'ml', 72, 'AI', True),
        ('LangChain / LangGraph', 'ml', 66, 'LG', False),
        ('AWS fundamentals', 'devops', 68, 'AWS', True),
        ('Railway deployment', 'devops', 70, 'RW', False),
        ('Docker Compose', 'devops', 64, 'DC', False),
        ('Git / GitHub', 'tools', 76, 'Git', False),
        ('API testing', 'tools', 70, 'API', False),
    ]
    for order, (name, category, proficiency, icon, featured) in enumerate(skill_data, start=1):
        Skill.objects.update_or_create(
            name=name,
            defaults={
                'category': category,
                'proficiency': proficiency,
                'icon_class': icon,
                'order': order,
                'is_featured': featured,
            },
        )
    Skill.objects.filter(name__in=[
        'Backend Development',
        'Fronted Development',
        'Full Stack',
        'RAG',
        'AWS Solution Architect',
    ]).delete()

    tech_colors = {
        'Django': '#54d6bd',
        'Flask': '#b9b3a8',
        'FastAPI': '#91b4ff',
        'Celery': '#d8a24a',
        'PostgreSQL': '#8fb8ff',
        'Redis': '#ef8f7a',
        'redis': '#ef8f7a',
        'Langchain': '#b7a4ff',
        'LangGraph': '#b7a4ff',
        'RAG': '#d8a24a',
        'MCP': '#54d6bd',
    }
    for tech in Technology.objects.all():
        tech.color = tech_colors.get(tech.name, '#b9b3a8')
        tech.save()

    exp1 = Experience.objects.filter(company__icontains='Ruwwaad').first()
    if exp1:
        exp1.title = 'Python Developer Intern'
        exp1.location = 'Lahore, Pakistan'
        exp1.description = (
            'Worked on Python/Django tasks in a team environment.\n'
            'Built and adjusted backend features, templates, and API-connected flows.\n'
            'Practiced debugging, code organization, and turning project requirements into working features.'
        )
        exp1.start_date = date(2025, 2, 1)
        exp1.end_date = date(2025, 7, 31)
        exp1.is_current = False
        exp1.save()

    exp2 = Experience.objects.filter(company__icontains='PITB').first()
    if exp2:
        exp2.title = 'Python Developer'
        exp2.company = 'PITB Incubation Center'
        exp2.location = 'Lahore, Pakistan'
        exp2.description = (
            'Worked on Python web application features with a focus on Django/Flask-style backend development.\n'
            'Built API-oriented flows, handled data operations, and improved project structure for maintainability.\n'
            'Contributed to deployment preparation, integration tasks, and day-to-day debugging across frontend/backend touchpoints.'
        )
        exp2.start_date = date(2025, 1, 1)
        exp2.end_date = None
        exp2.is_current = True
        exp2.save()

    edu = Education.objects.filter(degree__icontains='Bachelor').first()
    if edu:
        edu.degree = 'BS Computer Science'
        edu.institution = 'University of Education'
        edu.description = 'Final-year computer science student focused on software engineering, databases, backend development, AI/API integrations, and real-world web application projects.'
        edu.start_year = 2023
        edu.end_year = 2027
        edu.is_current = True
        edu.save()

    project = Project.objects.filter(slug='alpharexx').first() or Project.objects.first()
    if project:
        project.title = 'AlphaRexx Trading SaaS'
        project.tagline = 'Django-based crypto signal platform with subscriptions, Telegram delivery, admin workflows, Redis queues, and AI-assisted features.'
        project.description = 'A client-style Django SaaS project for crypto trading signals. I built the backend-heavy parts of the system: user onboarding, subscription and activation flows, dashboard data, Telegram bot integration, background services, admin tools, and AI-assisted interaction features.'
        project.challenge = 'The project needed to be more than a simple signal bot. Users needed plans, activation keys, Telegram access, risk settings, signal history, dashboard visibility, and support/admin workflows. The difficult part was connecting many moving pieces without turning the app into one large, fragile process.'
        project.solution = 'I structured the product around a Django web app, REST-style endpoints, PostgreSQL data models, Redis-backed queues/state, and separate background services for market data, scanning, dispatching, Telegram delivery, monitoring, and expiry handling.\n\nI also worked on admin workflows for users, manual payments, activation keys, support tickets, and operational review. For AI features, I integrated OpenAI-powered assistant flows and a Shariah audit path through a small FastAPI service and Django proxy endpoints.'
        project.detailed_description = 'Key work included authentication and dashboards, subscription checks, activation-key flows, Telegram bot connection, signal records, per-user risk settings, admin review screens, Redis coordination, Docker Compose services, and deployment preparation with Nginx, PostgreSQL, and Redis.\n\nThe most important engineering decision was separating real-time responsibilities into smaller services instead of keeping everything inside one Django request cycle or one bot loop. That made the system easier to reason about, debug, and operate.'
        project.results = 'The result was a complete working SaaS-style platform with product pages, authenticated dashboard, admin operations, signal pipeline, Telegram delivery, AI interaction layer, and deployment structure. It gave the client a practical base to test the business workflow and continue improving the trading logic.'
        project.is_featured = True
        project.order = 1
        project.save()


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
        ('core', '0002_certification'),
    ]

    operations = [
        migrations.RunPython(refresh_portfolio_content, migrations.RunPython.noop),
    ]
