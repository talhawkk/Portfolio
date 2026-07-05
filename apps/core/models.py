from django.db import models


class SiteConfiguration(models.Model):
    """Singleton model for site-wide configuration — fully manageable from Django Admin."""

    # Personal Info
    full_name = models.CharField(max_length=100, default='Talha Abbas')
    title = models.CharField(max_length=200, default='Full-Stack Engineer & AI Developer')
    hero_title_line1 = models.CharField(max_length=100, default='I build things that', help_text='Hero section main heading (first line, normal text)')
    hero_title_line2 = models.CharField(max_length=100, default='actually work.', help_text='Hero section main heading (second line, gradient text)')
    hero_subtitle_prefix = models.CharField(max_length=100, default='Software Engineer', help_text='Bold prefix text before the subtitle')
    subtitle = models.TextField(default='— I build complete applications that solve real problems. From writing the core logic to integrating AI, I focus on making software that is reliable and actually gets the job done.', help_text='Main paragraph for hero section')
    bio = models.TextField(blank=True, help_text='Short bio for About preview section')
    detailed_bio = models.TextField(blank=True, help_text='Extended bio for the About page')

    # Profile
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)
    resume_file = models.FileField(upload_to='resume/', blank=True, null=True, help_text='Downloadable CV/Resume PDF')

    # Social Links
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    email = models.EmailField(default='contact@talhaabbas.dev')

    # SEO
    meta_description = models.CharField(max_length=300, blank=True, help_text='SEO meta description for home page')
    meta_keywords = models.CharField(max_length=300, blank=True)
    og_image = models.ImageField(upload_to='og/', blank=True, null=True, help_text='Default Open Graph social-share image (1200×630). Falls back to generated og-default.png.')
    canonical_domain = models.CharField(max_length=200, default='https://talhawkk.me', help_text='Canonical production domain (no trailing slash)')
    twitter_handle = models.CharField(max_length=50, default='@talhaabbasali5', help_text='Twitter/X handle (with @)')
    location = models.CharField(max_length=100, default='Pakistan', help_text='Location shown on contact page + Person schema')

    # Stats
    years_experience = models.PositiveIntegerField(default=3)
    projects_completed = models.PositiveIntegerField(default=10)
    technologies_used = models.PositiveIntegerField(default=20)

    class Meta:
        verbose_name = 'Site Configuration'
        verbose_name_plural = 'Site Configuration'

    def __str__(self):
        return f'{self.full_name} — Site Config'

    def save(self, *args, **kwargs):
        # Enforce singleton
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        config, _ = cls.objects.get_or_create(pk=1)
        return config


class Skill(models.Model):
    """Skills/Technologies — manageable from Admin."""

    CATEGORY_CHOICES = [
        ('backend', 'Backend Engineering'),
        ('ai', 'AI Engineering'),
        ('cloud', 'Cloud & DevOps'),
        ('database', 'Databases & Storage'),
        ('languages', 'Core Languages'),
        ('frontend', 'Frontend & UI'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.PositiveIntegerField(default=80, help_text='Proficiency percentage (0-100)')
    icon_class = models.CharField(max_length=100, blank=True, help_text='CSS icon class or SVG icon name')
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False, help_text='Show in the featured skills section')

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'

    def __str__(self):
        return f'{self.name} ({self.get_category_display()})'


class Experience(models.Model):
    """Work experience / timeline entries — manageable from Admin."""

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    company_url = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    description = models.TextField(help_text='Use bullet points separated by newlines')
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-start_date']
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'

    def __str__(self):
        return f'{self.title} at {self.company}'

    @property
    def duration_display(self):
        if self.is_current:
            return f"{self.start_date.strftime('%b %Y')} — Present"
        if self.end_date:
            return f"{self.start_date.strftime('%b %Y')} — {self.end_date.strftime('%b %Y')}"
        return self.start_date.strftime('%b %Y')


class Education(models.Model):
    """Education entries — manageable from Admin."""

    degree = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    institution_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-start_year']
        verbose_name = 'Education'
        verbose_name_plural = 'Education'

    def __str__(self):
        return f'{self.degree} — {self.institution}'


class ContactSubmission(models.Model):
    """Contact form submissions — viewable from Admin."""

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'

    def __str__(self):
        return f'{self.name} — {self.subject} ({self.created_at.strftime("%Y-%m-%d")})'


class Certification(models.Model):
    """International Certifications — manageable from Admin."""
    name = models.CharField(max_length=200)
    issuing_organization = models.CharField(max_length=200)
    issue_date = models.DateField()
    expiration_date = models.DateField(blank=True, null=True)
    credential_id = models.CharField(max_length=100, blank=True)
    credential_url = models.URLField(blank=True)
    badge_image = models.ImageField(upload_to='certifications/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-issue_date', 'order']
        verbose_name = 'Certification'
        verbose_name_plural = 'Certifications'

    def __str__(self):
        return f'{self.name} — {self.issuing_organization}'
