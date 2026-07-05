from django.db import migrations

def update_site(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    Site.objects.update_or_create(
        id=1,
        defaults={
            'domain': 'talhawkk.me',
            'name': 'Talha Abbas'
        }
    )

def reverse_update(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_seo_content_refresh'),
        ('sites', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(update_site, reverse_code=reverse_update),
    ]
