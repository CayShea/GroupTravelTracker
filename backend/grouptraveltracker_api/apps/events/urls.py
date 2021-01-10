from rest_framework import routers
from .views import EventViewSet

router = routers.DefaultRouter()
router.trailing_slash = "/?"

router.register(r'events', EventViewSet, basename="events")


urlpatterns = router.urls

# n4JCE5XiHVjkuBLupMjXms

# DT5CBu35LDCaWBjm8gtL3V/   (?P<trip_id>.+)/