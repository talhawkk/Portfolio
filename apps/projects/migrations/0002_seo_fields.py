# SEO fields on Project — meta_description + og_image

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='meta_description',
            field=models.CharField(blank=True, help_text='SEO meta description (max 160 chars). Falls back to tagline.', max_length=160),
        ),
        migrations.AddField(
            model_name='project',
            name='og_image',
            field=models.ImageField(blank=True, help_text='Per-project Open Graph image (1200×630). Falls back to featured_image or site default.', null=True, upload_to='projects/og/'),
        ),
    ]
