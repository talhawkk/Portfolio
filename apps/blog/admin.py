from django.contrib import admin
from .models import Category, Tag, BlogPost


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'color', 'order')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('order', 'color')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_published', 'is_featured', 'reading_time', 'published_date')
    list_filter = ('is_published', 'is_featured', 'category', 'tags')
    list_editable = ('is_published', 'is_featured')
    search_fields = ('title', 'excerpt', 'content')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)
    date_hierarchy = 'published_date'

    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Taxonomy', {
            'fields': ('category', 'tags')
        }),
        ('Publishing', {
            'fields': ('author_name', 'is_published', 'is_featured', 'published_date')
        }),
        ('SEO & Social', {
            'fields': ('meta_description', 'og_image'),
            'classes': ('collapse',)
        }),
    )
