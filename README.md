# 🩺 Doctor Appointment Booking System

NestJS backend system for managing doctor appointments with SQLite database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- No additional database setup required (uses SQLite)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment** (optional)
   ```bash
   cp env.example .env
   # Update .env if needed (defaults work with SQLite)
   ```

3. **Start application**
   ```bash
   npm run start:dev
   ```

4. **Seed database** (optional)
   ```bash
   npm run seed
   ```

## 📚 API Endpoints

### Doctors
- `GET /api/v1/doctors` - List all doctors
- `GET /api/v1/doctors/:id` - Get doctor details
- `GET /api/v1/doctors/:id/available-slots?date=2024-01-15` - Get available time slots
- `POST /api/v1/doctors` - Create doctor
- `PATCH /api/v1/doctors/:id` - Update doctor
- `DELETE /api/v1/doctors/:id` - Delete doctor

### Appointments
- `GET /api/v1/appointments` - List appointments
- `POST /api/v1/appointments` - Book appointment
- `GET /api/v1/appointments/:id` - Get appointment details
- `PATCH /api/v1/appointments/:id/status` - Update appointment status
- `DELETE /api/v1/appointments/:id` - Cancel appointment

## 🔧 Business Rules

- No double booking for same time slot
- No weekend appointments
- No past appointments
- Appointments within working hours only
- Automatic overlap detection

## 🧪 Testing

```bash
# Run the test script
node test-app.js

# Or use curl commands
# Create doctor
curl -X POST http://localhost:3000/api/v1/doctors \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Dr. John","lastName":"Doe","email":"john@hospital.com","phone":"+1-555-0100","specialization":"cardiology","startTime":"09:00","endTime":"17:00"}'

# Book appointment
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"DOCTOR_ID","patientFirstName":"Jane","patientLastName":"Smith","patientEmail":"jane@email.com","patientPhone":"+1-555-0200","appointmentDate":"2024-01-15","startTime":"10:00"}'
```

## 🗄️ Database

The application uses **SQLite** for simplicity and ease of development:
- Database file: `database.sqlite`
- Auto-created on first run
- No additional setup required
- Perfect for development and small-scale deployments

## 🏗️ Architecture

- **NestJS** - Framework
- **TypeORM** - Database ORM
- **SQLite** - Database (file-based)
- **Class-validator** - Validation
- **Clean Architecture** - Modular design

## 📝 License

MIT License 