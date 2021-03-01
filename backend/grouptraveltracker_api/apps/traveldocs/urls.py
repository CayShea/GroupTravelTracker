
from django.urls import path
from rest_framework import routers
from .views import TraveldocsViewSet

router = routers.DefaultRouter()
router.trailing_slash = "/?"

router.register(r'traveldocs', TraveldocsViewSet, basename="traveldocs")

urlpatterns = router.urls