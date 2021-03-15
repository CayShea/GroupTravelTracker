
from django.urls import path
from rest_framework import routers
from .views import ChecklistItemViewSet

router = routers.DefaultRouter()
router.trailing_slash = "/?"

router.register(r'checklist_items', ChecklistItemViewSet, basename="checklist_items")

urlpatterns = router.urls