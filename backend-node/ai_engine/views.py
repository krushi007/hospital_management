from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .disease_finder import predict_disease, get_all_symptoms
from .risk_analyzer import analyze_risk
from .prescription_analyzer import analyze_prescription


class DiseasePredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        symptoms = request.data.get('symptoms', [])
        if not symptoms:
            return Response({'error': 'Please provide at least one symptom.'}, status=400)
        result = predict_disease(symptoms)
        return Response(result)


class SymptomsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'symptoms': get_all_symptoms()})


class RiskAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        patient_data = dict(request.data)
        if not patient_data:
            return Response({'error': 'Please provide patient data.'}, status=400)
        # Convert numeric string fields
        for field in ['age', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'blood_sugar', 'cholesterol']:
            if field in patient_data and patient_data[field]:
                try:
                    patient_data[field] = int(patient_data[field])
                except (ValueError, TypeError):
                    pass
        for field in ['bmi']:
            if field in patient_data and patient_data[field]:
                try:
                    patient_data[field] = float(patient_data[field])
                except (ValueError, TypeError):
                    pass
        result = analyze_risk(patient_data)
        return Response(result)


class PrescriptionAnalyzeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Analyze prescription data without requiring a saved prescription."""
        medications = request.data.get('medications', [])
        patient_allergies = request.data.get('patient_allergies', '') or request.data.get('allergies', '')

        if not medications:
            return Response({'error': 'Please provide medications list.'}, status=400)

        # Create a mock prescription-like object
        class MockPrescription:
            def __init__(self, meds, allergies):
                self.medications = meds
                self.patient = type('obj', (object,), {'allergies': allergies})()

        mock = MockPrescription(medications, patient_allergies)
        result = analyze_prescription(mock)
        return Response(result)
