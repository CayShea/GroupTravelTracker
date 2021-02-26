
from django.urls import path
from rest_framework import routers
from .views import NotesViewSet

router = routers.DefaultRouter()
router.trailing_slash = "/?"

router.register(r'notes', NotesViewSet, basename="notes")

urlpatterns = router.urls