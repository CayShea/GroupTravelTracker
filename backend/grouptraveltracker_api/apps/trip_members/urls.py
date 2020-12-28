from rest_framework import routers
from .views import TripMemberViewSet

router = routers.DefaultRouter()
router.trailing_slash = "/?"

router.register(r'trip_members', TripMemberViewSet, basename="trip_members")

urlpatterns = router.urls