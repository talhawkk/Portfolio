from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.models import Project
from apps.blog.models import BlogPost
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer,
    BlogPostListSerializer, BlogPostDetailSerializer,
    ContactSerializer,
)


class ProjectListAPIView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        tech = self.request.query_params.get('tech')
        if tech:
            qs = qs.filter(technologies__slug=tech)
        featured = self.request.query_params.get('featured')
        if featured:
            qs = qs.filter(is_featured=True)
        return qs


class ProjectDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProjectDetailSerializer
    queryset = Project.objects.all()
    lookup_field = 'slug'


class BlogPostListAPIView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    queryset = BlogPost.objects.filter(is_published=True)

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)
        return qs


class BlogPostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = BlogPostDetailSerializer
    queryset = BlogPost.objects.filter(is_published=True)
    lookup_field = 'slug'


class ContactAPIView(APIView):
    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Message sent successfully!'}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
