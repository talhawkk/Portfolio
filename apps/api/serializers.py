from rest_framework import serializers
from apps.projects.models import Project, Technology, ProjectImage
from apps.blog.models import BlogPost, Category, Tag
from apps.core.models import ContactSubmission


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name', 'slug', 'color', 'icon_class']


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'order']


class ProjectListSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'title', 'slug', 'tagline', 'description',
                  'featured_image', 'thumbnail', 'technologies',
                  'live_url', 'github_url', 'is_featured', 'created_at']


class ProjectDetailSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'color']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class BlogPostListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'featured_image',
                  'category', 'tags', 'author_name', 'published_date',
                  'reading_time', 'is_featured']


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['name', 'email', 'subject', 'message']
