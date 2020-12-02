from rest_framework import serializers
from django.http.request import QueryDict
from .models import Trip, CustomUser
import logging

LOG = logging.getLogger(__name__)


# def get_filtered_queryset(
#     filter_querystring: str,
#     filter_class: typing.Type["FilterSet"],
#     queryset: "QuerySet",
#     request: typing.Optional["Request"] = None,
#     user: typing.Optional["AuthUser"] = None,
# ) -> "QuerySet":
#     """
#     Applies a filter query string to a QuerySet via provided FilterSet
#     """

#     class _Request:
#         def __init__(self, user):
#             self.user = user

#     if request is None:
#         request = _Request(user=user)

#     filter = filter_class(request=request, data=QueryDict(filter_querystring), queryset=queryset)

#     if not filter.is_valid():
#         return queryset.none()
#     return filter.qs


# class _BulkViewSet(viewsets.ViewSet):
#     permission_classes = (IsAuthenticated,)
#     http_method_names = ("delete",)
#     create = None  # HEREBEDRAGONS: If create is not defined on this class, all other methods 404 for christ knows why
#     bulk_delete_serializer_class: Type[serializers.Serializer] = None
#     filter_class = None

#     @swagger_auto_schema(request_body=BulkDeleteSerializer(), responses={status.HTTP_204_NO_CONTENT: ""})
#     def delete(self, request: Request) -> Response:
#         serializer = self.bulk_delete_serializer_class(
#             context={"request": request, "filter_class": self.filter_class}, data=request.data
#         )
#         serializer.is_valid(raise_exception=True)

#         delete_objects_iterator = serializer.validated_data.get("delete_objects_iterator")
#         permission_check_objects = serializer.validated_data.get("permission_check_objects")
#         is_project_object = delete_objects_iterator.model in {
#             Project,
#             Building,
#             Level,
#             Department,
#             Room,
#             SkuPlacement,
#         }
#         if is_project_object and not BulkEditProjectPermission().has_object_permission(
#             request, self, permission_check_objects
#         ):
#             raise exceptions.PermissionDenied()
#         elif delete_objects_iterator.model in {
#             Template,
#             TemplateObject,
#         } and not TemplatePermission.has_bulk_object_permission(request, permission_check_objects):
#             raise exceptions.PermissionDenied()

#         es_index = get_es_index(request.user.org)
#         es_client = elasticsearch_client()
#         redis_conn = search_result_redis_conn()
#         model_cache_prefix = get_model_cache_prefix(SkuPlacement)

#         if is_project_object:
#             project_ids = get_project_ids(delete_objects_iterator.queryset)

#         for chunk in delete_objects_iterator:  # TODO: Async with consumer in bulk
#             with suppress(TypeError):
#                 queryset = get_skups_for_queryset(chunk)
#                 skups = QuerySetChunkedIterator(queryset)
#                 for skup_chunk in skups:
#                     skup_ids = [str(s.id) for s in skup_chunk]
#                     self._delete_from_es(es_client, es_index, skup_ids)
#                     redis_conn.delete(*[f"{model_cache_prefix}.{i}" for i in skup_ids])

#             # Delete from RDBMS. HEREBEDRAGONS: Cascades will be followed, but delete signals will not fire
#             chunk.delete()

#         send_nonce_task_complete(get_request_nonce(request), True)
#         return Response(status=status.HTTP_204_NO_CONTENT)

#     def _delete_from_es(self, es_client, es_index, skup_ids, retries=0):
#         """
#         HEREBEDRAGONS: This is copied for now from apps.projects.consumers and will be deleted once other endpoints
#             are made async
#         """
#         es_response = bulk(
#             es_client,
#             [
#                 {"_op_type": "delete", "_index": es_index, "_type": skup_es_model().index_label, "_id": i}
#                 for i in skup_ids
#             ],
#             chunk_size=settings.ES_BULK_CHUNK_SIZE,
#             request_timeout=settings.ES_BULK_REQUEST_TIMEOUT,
#             stats_only=True,
#             max_retries=2,
#             raise_on_error=False,
#             raise_on_exception=False,
#         )
#         if es_response[1] and retries < 3:
#             LOG.warning("Failed to delete %s out of %s docs from ES. Retrying", es_response[1], len(skup_ids))
#             self._delete_from_es(es_client, es_index, skup_ids, retries + 1)


# class BulkDeleteSerializer(serializers.Serializer):
#     ids = serializers.ListField(
#         # allow for both UUID's and ShortUUID's
#         child=serializers.CharField(required=False, allow_null=False),
#         required=False,
#         allow_empty=True,
#     )

#     model: Type[Model] = None

#     def _get_records(self, attrs: dict) -> dict:
#         raise NotImplementedError

#     def validate(self, attrs: dict) -> dict:
#         ids = attrs.get("ids", [])

#         record_data = self._get_records(attrs)
#         permission_check_objects = record_data["permission_check_objects"]
#         delete_objects_iterator = record_data["delete_objects_iterator"]
#         if ids and len(ids) != delete_objects_iterator.count():
#             raise serializers.ValidationError({"ids": "Invalid IDs provided."})
#         return {
#             "ids": ids,
#             "delete_objects_iterator": delete_objects_iterator,
#             "permission_check_objects": permission_check_objects,
#         }


# class BulkObjectDeleteSerializer(BulkDeleteSerializer):
#     def _get_records(self, attrs: dict) -> dict:
#         ids = attrs.get("ids", [])
#         project_id = attrs.get("project_id")

#         queryset = self.model.objects.filter(pk__in=ids)
#         projects = queryset.values_list("id", flat=True).distinct()

#         # return {
#         #     "delete_objects_iterator": QuerySetChunkedIterator(queryset),
#         #     "permission_check_objects": Project.objects.filter(pk__in=projects),
#         # }

# class BulkTripDeleteSerializer(BulkObjectDeleteSerializer):
#     model = Trip