from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import TaskViewSet, register


router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("register/", register, name="register"),
]

urlpatterns += router.urls