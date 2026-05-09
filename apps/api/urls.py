from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('projects/', views.ProjectListAPIView.as_view(), name='project-list'),
    path('projects/<slug:slug>/', views.ProjectDetailAPIView.as_view(), name='project-detail'),
    path('blog/', views.BlogPostListAPIView.as_view(), name='blog-list'),
    path('blog/<slug:slug>/', views.BlogPostDetailAPIView.as_view(), name='blog-detail'),
    path('contact/', views.ContactAPIView.as_view(), name='contact'),
]
