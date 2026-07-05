"""
Data migration — refresh SEO content so the site ranks for
"Talha Abbas", "Talha Abbas Ali", and "talhawkk".

Notable change: introduces the full name "Talha Abbas Ali" naturally into the
detailed bio and meta description (the X handle talhaabbasali5 hints at it but
the name appears nowhere in the original content).
"""

from django.db import migrations


NEW_META_DESCRIPTION = (
    "Talha Abbas (Talha Abbas Ali / talhawkk) is a Python/Django developer and "
    "final-year CS student in Pakistan building web apps, REST APIs, AI "
    "integrations, and cloud-deployed backend systems."
)

NEW_META_KEYWORDS = (
    "Talha Abbas, Talha Abbas Ali, talhawkk, Python developer, Django developer, "
    "Flask, REST APIs, AI integration, backend developer, full-stack engineer, "
    "Pakistan developer, computer science student"
)

NEW_DETAILED_BIO = (
    "I'm Talha Abbas Ali — most people online know me as talhawkk. I'm a final-year "
    "BS Computer Science student in Pakistan, focused on Python web development.\n\n"
    "My strongest work is around Django and Flask applications, REST APIs, admin "
    "workflows, PostgreSQL and Redis backed features, and practical AI/API "
    "integrations. I have built real project and client-style systems where the "
    "work goes beyond a landing page: authentication, dashboards, payment or "
    "activation flows, Telegram/API integrations, background services, deployment "
    "setup, and data handling.\n\n"
    "I am still early in my career, but I care about writing understandable code, "
    "structuring projects cleanly, and making the product usable for the people "
    "who depend on it. I am looking for internships, junior Python/Django roles, "
    "backend or full-stack opportunities, AI integration work, and cloud-based "
    "web app projects where I can keep learning while contributing useful "
    "engineering work."
)

NEW_BIO = (
    "I'm Talha Abbas Ali (talhawkk) — a final-year BS Computer Science student "
    "working mainly with Python, Django, Flask, REST APIs, data workflows, and "
    "AI/API integrations."
)


def update_site_config(apps, schema_editor):
    SiteConfiguration = apps.get_model('core', 'SiteConfiguration')
    SiteConfiguration.objects.filter(pk=1).update(
        meta_description=NEW_META_DESCRIPTION,
        meta_keywords=NEW_META_KEYWORDS,
        detailed_bio=NEW_DETAILED_BIO,
        bio=NEW_BIO,
    )


def reverse_update(apps, schema_editor):
    # No reliable reverse — leave SEO content as-is on rollback.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_seo_fields'),
    ]

    operations = [
        migrations.RunPython(update_site_config, reverse_code=reverse_update),
    ]
