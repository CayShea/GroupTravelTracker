from rest_framework import routers
from .views import CustomUserViewSet, CustomRegisterView

router = routers.DefaultRouter()
router.trailing_slash = "/?"

router.register(r'users', CustomUserViewSet, basename="users")

urlpatterns = router.urls