from django.urls import path
from . import views

urlpatterns = [
    path('disease-predict/', views.DiseasePredictView.as_view(), name='disease-predict'),
    path('symptoms/', views.SymptomsListView.as_view(), name='symptoms-list'),
    path('risk-analysis/', views.RiskAnalysisView.as_view(), name='risk-analysis'),
    path('prescription-analyze/', views.PrescriptionAnalyzeView.as_view(), name='prescription-analyze'),
]
