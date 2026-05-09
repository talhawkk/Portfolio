from django.db import models
from django.utils.text import slugify
from django.utils import timezone


class Category(models.Model):
    """Blog categories — manageable from Admin."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#00d4ff', help_text='Hex accent color')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    """Blog tags — manageable from Admin."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    """Blog posts — fully manageable from Admin."""

    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(max_length=500, help_text='Short preview text for blog cards')
    content = models.TextField(help_text='Full blog post content (supports HTML)')

    # Media
    featured_image = models.ImageField(upload_to='blog/featured/', blank=True, null=True)

    # Taxonomy
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')

    # Meta
    author_name = models.CharField(max_length=100, default='Talha Abbas')
    published_date = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    reading_time = models.PositiveIntegerField(default=5, help_text='Estimated reading time in minutes')

    # SEO
    meta_description = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ['-published_date']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Auto-calculate reading time (~200 words/min)
        if self.content:
            word_count = len(self.content.split())
            self.reading_time = max(1, round(word_count / 200))
        super().save(*args, **kwargs)
