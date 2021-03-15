
from django.urls import path
from rest_framework import routers
from .views import ChecklistViewSet

router = routers.DefaultRouter()
router.trailing_slash = "/?"

router.register(r'checklists', ChecklistViewSet, basename="checklists")

urlpatterns = router.urls