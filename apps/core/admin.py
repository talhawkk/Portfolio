from django.contrib import admin
from .models import SiteConfiguration, Skill, Experience, Education, ContactSubmission, Certification


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('name', 'issuing_organization', 'issue_date', 'order')
    list_editable = ('order',)
    search_fields = ('name', 'issuing_organization', 'credential_id')
    ordering = ('-issue_date', 'order')


@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    """Admin for the singleton site configuration."""

    fieldsets = (
        ('Personal Info', {
            'fields': ('full_name', 'title', 'hero_title_line1', 'hero_title_line2', 'hero_subtitle_prefix', 'subtitle', 'bio', 'detailed_bio')
        }),
        ('Profile', {
            'fields': ('profile_image', 'resume_file')
        }),
        ('Social Links', {
            'fields': ('github_url', 'linkedin_url', 'twitter_url', 'email')
        }),
        ('Stats', {
            'fields': ('years_experience', 'projects_completed', 'technologies_used'),
            'description': 'These numbers appear in the stats counter section.'
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        # Only allow one instance
        return not SiteConfiguration.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'is_featured', 'order')
    list_filter = ('category', 'is_featured')
    list_editable = ('proficiency', 'is_featured', 'order')
    search_fields = ('name',)
    ordering = ('order',)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'start_date', 'end_date', 'is_current', 'order')
    list_filter = ('is_current',)
    list_editable = ('order', 'is_current')
    ordering = ('-start_date',)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_year', 'end_year', 'is_current', 'order')
    list_editable = ('order',)
    ordering = ('-start_year',)


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at')
    list_editable = ('is_read',)

    def has_add_permission(self, request):
        return False
