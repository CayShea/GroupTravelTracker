from rest_framework import routers
from .views import TripViewSet

router = routers.DefaultRouter()
router.trailing_slash = "/?"

router.register(r'trips', TripViewSet, basename="trips")
# router.register(r"trips/bulk", TripBulkViewSet, base_name="trips-bulk")

urlpatterns = router.urls