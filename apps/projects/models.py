from django.db import models
from django.utils.text import slugify
from io import BytesIO
import sys
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile


class Technology(models.Model):
    """Technologies/tools used in projects — manageable from Admin."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    color = models.CharField(max_length=7, default='#00d4ff', help_text='Hex color code')
    icon_class = models.CharField(max_length=100, blank=True, help_text='CSS icon class')

    class Meta:
        ordering = ['name']
        verbose_name = 'Technology'
        verbose_name_plural = 'Technologies'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Project(models.Model):
    """Portfolio projects — fully manageable from Admin."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    tagline = models.CharField(max_length=300, help_text='Short one-liner displayed on project cards')
    description = models.TextField(help_text='Brief project overview')
    detailed_description = models.TextField(blank=True, help_text='Extended case study content (supports HTML)')

    # Links
    live_url = models.URLField(blank=True, help_text='Live demo URL')
    github_url = models.URLField(blank=True, help_text='GitHub repository URL')

    # Media
    featured_image = models.ImageField(upload_to='projects/featured/', help_text='Main project image')
    thumbnail = models.ImageField(upload_to='projects/thumbnails/', blank=True, null=True)

    # Relationships
    technologies = models.ManyToManyField(Technology, blank=True, related_name='projects')

    # Meta
    is_featured = models.BooleanField(default=False, help_text='Show on home page')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Case study fields
    challenge = models.TextField(blank=True, help_text='What problem did this project solve?')
    solution = models.TextField(blank=True, help_text='How did you solve it?')
    results = models.TextField(blank=True, help_text='What were the outcomes/metrics?')

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ProjectImage(models.Model):
    """Additional project images for case study galleries — manageable from Admin."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Project Image'
        verbose_name_plural = 'Project Images'

    def __str__(self):
        return f'{self.project.title} — Image {self.order}'

    def save(self, *args, **kwargs):
        is_new_image = False
        if not self.pk:
            is_new_image = True
        else:
            try:
                orig = ProjectImage.objects.get(pk=self.pk)
                if orig.image != self.image:
                    is_new_image = True
            except ProjectImage.DoesNotExist:
                is_new_image = True

        if is_new_image and self.image:
            try:
                img = Image.open(self.image)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize if larger than 1920x1080
                img.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
                
                output = BytesIO()
                img.save(output, format='JPEG', quality=75, optimize=True)
                output.seek(0)
                
                # Ensure .jpg extension
                file_name = self.image.name.rsplit('.', 1)[0] + '.jpg'
                
                self.image = InMemoryUploadedFile(
                    output,
                    'ImageField',
                    file_name,
                    'image/jpeg',
                    sys.getsizeof(output),
                    None
                )
            except Exception as e:
                pass # If image processing fails, save the original image
                
        super().save(*args, **kwargs)
