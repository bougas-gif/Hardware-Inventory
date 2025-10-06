# Inventory Lookup

Internal Square web application for quick inventory lookups across facilities and subinventories.

## Overview

This application provides a simple interface for looking up current inventory levels by SKU, with breakdowns by:
- Facility
- Subinventory type
- Availability status (On Hand, Available to Reserve, Reserved)

## Technology Stack

- Frontend:
  - React
  - Square UI components
  - TypeScript

- Backend:
  - Python Flask
  - Snowflake integration
  - Square SSO authentication

## Development

### Prerequisites
- Square development environment
- Access to Square's Snowflake instance
- Node.js and Python installed

### Setup
1. Clone the repository
2. Set up backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set up frontend:
   ```bash
   cd frontend
   npm install
   ```

### Running locally
1. Start backend:
   ```bash
   cd backend
   source venv/bin/activate
   flask run
   ```
2. Start frontend:
   ```bash
   cd frontend
   npm start
   ```

## Deployment

The application is deployed to Square's internal infrastructure using standard Square deployment processes.

## Security

This application follows Square's security best practices:
- Square SSO authentication
- Role-based access control
- Audit logging
- Secure Snowflake connection

## Contributing

Follow Square's standard development workflow:
1. Create a feature branch
2. Make changes
3. Submit PR
4. Get review
5. Merge to main

## Support

For issues or questions, contact:
- #inventory-lookup-support in Slack
- Create an issue in this repository
