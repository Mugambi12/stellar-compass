import unittest
from main import create_app
from config import TestConfig
from exts import db


class MedicationAPITestCase(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client(self)

        with self.app.app_context():
            db.init_app(self.app)
            db.create_all()


    def test_get_all_medications(self):
        response = self.client.get('/medicines/medications')
        self.assertEqual(response.status_code, 200)

    def test_create_medication(self):
        data = {
            'name': 'Test Medication',
            'description': 'Test Description',
            'dosage': 'Test Dosage',
            'manufacturer': 'Test Manufacturer',
            'expiry_date': '2024-12-31',
            'category': 'Test Category',
            'price': 10.0,
            'stock_quantity': 100
        }
        response = self.client.post('/medicines/medications', json=data)
        self.assertEqual(response.status_code, 200)

    def test_get_medication_by_id(self):
        # First, create a medication to ensure it exists
        data = {
            'name': 'Test Medication',
            'description': 'Test Description',
            'dosage': 'Test Dosage',
            'manufacturer': 'Test Manufacturer',
            'expiry_date': '2024-12-31',
            'category': 'Test Category',
            'price': 10.0,
            'stock_quantity': 100
        }
        create_response = self.client.post('/medicines/medications', json=data)
        self.assertEqual(create_response.status_code, 200)
        medication_id = create_response.json['id']

        # Then, fetch the medication by its ID
        response = self.client.get(f'/medicines/medications/{medication_id}')
        self.assertEqual(response.status_code, 200)

    def test_update_medication(self):
        # First, create a medication to ensure it exists
        data = {
            'name': 'Test Medication',
            'description': 'Test Description',
            'dosage': 'Test Dosage',
            'manufacturer': 'Test Manufacturer',
            'expiry_date': '2024-12-31',
            'category': 'Test Category',
            'price': 10.0,
            'stock_quantity': 100
        }
        create_response = self.client.post('/medicines/medications', json=data)
        self.assertEqual(create_response.status_code, 200)
        medication_id = create_response.json['id']

        # Update the medication
        updated_data = {
            'name': 'Updated Test Medication',
            'description': 'Updated Test Description'
        }
        response = self.client.put(f'/medicines/medications/{medication_id}', json=updated_data)
        self.assertEqual(response.status_code, 200)

    def test_delete_medication(self):
        # First, create a medication to ensure it exists
        data = {
            'name': 'Test Medication',
            'description': 'Test Description',
            'dosage': 'Test Dosage',
            'manufacturer': 'Test Manufacturer',
            'expiry_date': '2024-12-31',
            'category': 'Test Category',
            'price': 10.0,
            'stock_quantity': 100
        }
        create_response = self.client.post('/medicines/medications', json=data)
        self.assertEqual(create_response.status_code, 200)
        medication_id = create_response.json['id']

        # Delete the medication
        response = self.client.delete(f'/medicines/medications/{medication_id}')
        self.assertEqual(response.status_code, 200)


    @classmethod
    def tearDownClass(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

if __name__ == "__main__":
    unittest.main()
