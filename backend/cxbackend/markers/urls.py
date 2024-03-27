from django.urls import path
from markers.views import MarkersMapview


app_name = "markers"

urlpatterns = [
    path('map/', MarkersMapview.as_view()),

]

