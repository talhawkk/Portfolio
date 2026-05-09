from django.contrib import admin
from .models import Technology, Project, ProjectImage


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ('image', 'caption', 'order')


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'color')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'tagline', 'is_featured', 'order', 'created_at')
    list_filter = ('is_featured', 'technologies')
    list_editable = ('is_featured', 'order')
    search_fields = ('title', 'tagline', 'description')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('technologies',)
    inlines = [ProjectImageInline]

    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'slug', 'tagline', 'description', 'technologies')
        }),
        ('Links', {
            'fields': ('live_url', 'github_url')
        }),
        ('Media', {
            'fields': ('featured_image', 'thumbnail')
        }),
        ('Case Study', {
            'fields': ('detailed_description', 'challenge', 'solution', 'results'),
            'classes': ('collapse',)
        }),
        ('Display', {
            'fields': ('is_featured', 'order')
        }),
    )
