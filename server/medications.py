from flask import request, jsonify
from flask_restx import Resource, Namespace, fields
from models import Medication
from flask_jwt_extended import jwt_required

medicine_ns = Namespace('medicines', description='Medicine Operations')

# Model for Medication Serializer
medication_model = medicine_ns.model(
    'Medication', {
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
        'dosage': fields.String,
        'manufacturer': fields.String,
        'expiry_date': fields.Date,
        'category': fields.String,
        'price': fields.Float,
        'stock_quantity': fields.Integer,
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime
    }
)

@medicine_ns.route('/medications')
class MedicationResource(Resource):

    @medicine_ns.marshal_list_with(medication_model)
    def get(self):
        """Get all medications"""
        medications = Medication.query.all()
        return medications, 200

    @medicine_ns.marshal_with(medication_model)
    @medicine_ns.expect(medication_model)
    @jwt_required()
    def post(self):
        """Create a new medication"""
        data = request.get_json()
        new_medication = Medication(**data)
        new_medication.save()
        return new_medication, 201


@medicine_ns.route('/medications/<int:id>')
class MedicationResource(Resource):

    @medicine_ns.marshal_with(medication_model)
    def get(self, id):
        """Get a medication by id"""
        medication = Medication.query.get_or_404(id)
        return medication, 200

    @medicine_ns.marshal_with(medication_model)
    @jwt_required()
    def put(self, id):
        """Update a medication by id"""
        medication_to_update = Medication.query.get_or_404(id)
        data = request.get_json()
        medication_to_update.update(**data)

        return medication_to_update, 200

    @medicine_ns.marshal_with(medication_model)
    @jwt_required()
    def delete(self, id):
        """Delete a medication by id"""
        medication_to_delete = Medication.query.get_or_404(id)
        medication_to_delete.delete()
        return medication_to_delete, 200
