# SEO field on BlogPost — og_image

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='og_image',
            field=models.ImageField(blank=True, help_text='Per-post Open Graph image (1200×630). Falls back to featured_image or site default.', null=True, upload_to='blog/og/'),
        ),
    ]
