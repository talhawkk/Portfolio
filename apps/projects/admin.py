from django.contrib import admin
from django import forms
from django.db.models import Max
from .models import Technology, Project, ProjectImage

class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

class MultipleFileField(forms.FileField):
    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if not data:
            single_file_clean(None, initial)
            return []
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = [single_file_clean(data, initial)]
        return result

class ProjectAdminForm(forms.ModelForm):
    gallery_folder = MultipleFileField(
        widget=MultipleFileInput(attrs={'multiple': True, 'webkitdirectory': True, 'directory': True}),
        required=False,
        label="Upload Gallery Folder",
        help_text="Select a folder to upload all images inside it. The sequence will be based on file names. Images will be added to the gallery below."
    )
    gallery_multiple = MultipleFileField(
        widget=MultipleFileInput(attrs={'multiple': True}),
        required=False,
        label="Upload Multiple Images",
        help_text="Select multiple individual images to upload at once."
    )

    class Meta:
        model = Project
        fields = '__all__'

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
    form = ProjectAdminForm
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
        ('Bulk Gallery Upload', {
            'fields': ('gallery_folder', 'gallery_multiple'),
            'classes': ('collapse',)
        }),
        ('Case Study', {
            'fields': ('detailed_description', 'challenge', 'solution', 'results'),
            'classes': ('collapse',)
        }),
        ('Display', {
            'fields': ('is_featured', 'order')
        }),
    )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        # Get current max order
        current_max_order = obj.images.aggregate(Max('order'))['order__max']
        if current_max_order is None:
            current_max_order = -1

        # Retrieve files
        files = request.FILES.getlist('gallery_multiple')
        folder_files = request.FILES.getlist('gallery_folder')

        # Combine and sort to maintain sequence
        all_files = files + folder_files
        all_files.sort(key=lambda x: x.name)

        # Create ProjectImage objects
        for f in all_files:
            current_max_order += 1
            ProjectImage.objects.create(
                project=obj,
                image=f,
                order=current_max_order,
                caption=f.name
            )
