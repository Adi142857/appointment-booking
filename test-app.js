const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAPI() {
  try {
    console.log('🧪 Testing Doctor Appointment Booking API...\n');

    // Test 1: Create a doctor
    console.log('1. Creating a doctor...');
    const doctorData = {
      firstName: 'Dr. John',
      lastName: 'Doe',
      email: 'john.doe2@hospital.com',
      phone: '+1-555-0100',
      specialization: 'cardiology',
      startTime: '09:00',
      endTime: '17:00',
      appointmentDuration: 30
    };

    const doctorResponse = await axios.post(`${BASE_URL}/doctors`, doctorData);
    const doctorId = doctorResponse.data.id;
    console.log(`✅ Doctor created with ID: ${doctorId}\n`);

    // Test 2: Get available time slots
    console.log('2. Getting available time slots...');
    const slotsResponse = await axios.get(`${BASE_URL}/doctors/${doctorId}/available-slots?date=2025-12-15`);
    console.log(`✅ Available slots: ${slotsResponse.data.length} slots found\n`);

    // Test 3: Book an appointment
    console.log('3. Booking an appointment...');
    const appointmentData = {
      doctorId: doctorId,
      patientFirstName: 'Jane',
      patientLastName: 'Smith',
      patientEmail: 'jane.smith@email.com',
      patientPhone: '+1-555-0200',
      appointmentDate: '2025-12-15',
      startTime: '10:00'
    };

    const appointmentResponse = await axios.post(`${BASE_URL}/appointments`, appointmentData);
    const appointmentId = appointmentResponse.data.id;
    console.log(`✅ Appointment booked with ID: ${appointmentId}\n`);

    // Test 4: Try to book overlapping appointment (should fail)
    console.log('4. Testing double booking prevention...');
    try {
      await axios.post(`${BASE_URL}/appointments`, appointmentData);
      console.log('❌ Double booking should have failed!');
    } catch (error) {
      if (error.response.status === 409) {
        console.log('✅ Double booking correctly prevented\n');
      } else {
        console.log('❌ Unexpected error:', error.response.data);
      }
    }

    // Test 5: Get all doctors
    console.log('5. Getting all doctors...');
    const doctorsResponse = await axios.get(`${BASE_URL}/doctors`);
    console.log(`✅ Found ${doctorsResponse.data.doctors.length} doctors\n`);

    // Test 6: Get all appointments
    console.log('6. Getting all appointments...');
    const appointmentsResponse = await axios.get(`${BASE_URL}/appointments`);
    console.log(`✅ Found ${appointmentsResponse.data.appointments.length} appointments\n`);

    console.log('🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Only run if axios is available
if (typeof require !== 'undefined' && require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 