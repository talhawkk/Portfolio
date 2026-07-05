# Generated for SEO overhaul — adds og_image, canonical_domain, twitter_handle,
# location to SiteConfiguration.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_siteconfiguration_hero_subtitle_prefix_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='siteconfiguration',
            name='og_image',
            field=models.ImageField(blank=True, help_text='Default Open Graph social-share image (1200×630). Falls back to generated og-default.png.', null=True, upload_to='og/'),
        ),
        migrations.AddField(
            model_name='siteconfiguration',
            name='canonical_domain',
            field=models.CharField(default='https://talhawkk.me', help_text='Canonical production domain (no trailing slash)', max_length=200),
        ),
        migrations.AddField(
            model_name='siteconfiguration',
            name='twitter_handle',
            field=models.CharField(default='@talhaabbasali5', help_text='Twitter/X handle (with @)', max_length=50),
        ),
        migrations.AddField(
            model_name='siteconfiguration',
            name='location',
            field=models.CharField(default='Pakistan', help_text='Location shown on contact page + Person schema', max_length=100),
        ),
    ]
