# Appointment Scheduler Frontend

A React-based frontend for the Intelligent Service Appointment Scheduler.

## Features

- Schedule new appointments
- View all scheduled appointments
- Real-time updates
- Responsive design

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## API Integration

The frontend connects to the Spring Boot backend at `http://localhost:8080` (configurable via `.env` file).

### API Endpoints Expected:
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment

## Deployment

To deploy with the backend:
1. Build the React app: `npm run build`
2. Copy the `build` folder contents to `AppointmentScheduler/src/main/resources/static/`
3. Build the Spring Boot app: `mvn clean package`
4. Deploy the JAR file

## Development

- `npm start` - Start development server on port 3000
- `npm test` - Run tests
- `npm run build` - Build for production

## Environment Variables

Create a `.env` file in the frontend folder:
```
REACT_APP_API_URL=http://localhost:8080
```
