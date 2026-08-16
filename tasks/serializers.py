from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "is_completed",
            "created_at",
            "owner",
        ]
        read_only_fields = ["id", "created_at", "owner"]