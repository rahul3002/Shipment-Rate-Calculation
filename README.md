SHIPMENT RATE CALCULATION API
============================

Table of Contents
----------------
1. Project Overview
2. Setup Instructions
3. API Endpoints
4. Database Schema
5. Business Rules
6. Error Handling
7. Testing Guide

1. PROJECT OVERVIEW
------------------
A Node.js/Express API service for calculating shipment rates between different city blocks in India. The system handles various charges including base freight, fuel surcharge, ODA charges, and risk-based FOV charges.

2. SETUP INSTRUCTIONS
-------------------
a) Prerequisites:
   - Node.js (v14+)
   - MongoDB
   - npm/yarn

b) Installation:
```bash
git clone [repository-url]
cd shipment-rate-calculation
npm install
```

c) Environment Setup:
Create a .env file with:
```bash
MONGODB_URI=mongodb+srv://[your-connection-string]
PORT=5000
```

d) Start Server:
```bash
npm start
```

3. API ENDPOINTS
--------------
3.1 City Blocks Management

- Add City Block
  - Endpoint: POST /city-blocks/add
  - Body:
```json
{
    "cityName": "string",
    "blockName": "string"
}
```

- Get All City Blocks
  - Endpoint: GET /city-blocks
  - Response: Array of city blocks

3.2 Rate Matrix Management

- Update Rate
  - Endpoint: POST /rates/update
  - Body:
```json
{
    "OriginBlock": "string",
    "DestinationBlock": "string",
    "Rate": number
}
```

- Get All Rates
  - Endpoint: GET /rates

3.3 Shipment Rate Calculation

- Calculate Rate
  - Endpoint: POST /shipment/calculate-rate
  - Body:
```json
{
    "origin": "string",
    "destination": "string",
    "weight": number,
    "invoiceValue": number,
    "riskType": "owner" | "carrier"
}
```

4. DATABASE SCHEMA
----------------
4.1 CityBlock Collection
  - cityName: String (required)
  - blockName: String (required)

4.2 RateMatrix Collection
  - OriginBlock: String (required)
  - DestinationBlock: String (required)
  - Rate: Number (required)

5. BUSINESS RULES
---------------
5.1 Weight Rules
  - Minimum weight: 40 kg
  - Base freight calculation: max(400, weight * rate)

5.2 Charge Calculations
  - Fuel Surcharge: 20% of base freight
  - DKT Charges: Fixed Rs. 100
  - FOV Charges:
    * Owner Risk: max(0.05% of invoice value, Rs. 50)
    * Carrier Risk: max(2% of invoice value, Rs. 300)
  - ODA Charges:
    * ODA1: max(Rs. 750, weight * 5)
    * ODA2: max(Rs. 1500, weight * 7)
  - Appointment Charges: max(Rs. 1200, weight * 5)

5.3 ODA Zones
  - ODA2 applies to: "Rest of CG" and "REST of Vidharva" blocks
  - All other zones are ODA1

6. ERROR HANDLING
---------------
6.1 Input Validation Errors (400)
  - Missing required fields
  - Invalid weight (below 40 kg)
  - Invalid risk type
  - Invalid city blocks

6.2 Server Errors (500)
  - Database connection issues
  - Calculation errors
  - Rate matrix not found

7. TESTING GUIDE
--------------

1. CREATING CITY BLOCKS
----------------------

First, let's create several city blocks that we'll need:

- Add Indore (MP1):
  POST http://localhost:5000/city-blocks/add
  Request:
```json
{
    "cityName": "Indore",
    "blockName": "MP1"
}
```
  Response:
```json
{
    "_id": "65f1234567890",
    "cityName": "Indore",
    "blockName": "MP1"
}
```

- Add Bhopal (MP2):
  POST http://localhost:5000/city-blocks/add
```json
{
    "cityName": "Bhopal",
    "blockName": "MP2"
}
```

- Add Raipur (CG1):
  POST http://localhost:5000/city-blocks/add
```json
{
    "cityName": "Raipur",
    "blockName": "CG1"
}
```

- Add Rest of CG:
  POST http://localhost:5000/city-blocks/add
```json
{
    "cityName": "Bilaspur",
    "blockName": "Rest of CG"
}
```

- Verify City Blocks:
  GET http://localhost:5000/city-blocks
  Expected Response:
```json
[
    {
        "_id": "65f1234567890",
        "cityName": "Indore",
        "blockName": "MP1"
    },
    {
        "_id": "65f1234567891",
        "cityName": "Bhopal",
        "blockName": "MP2"
    },
    {
        "_id": "65f1234567892",
        "cityName": "Raipur",
        "blockName": "CG1"
    },
    {
        "_id": "65f1234567893",
        "cityName": "Bilaspur",
        "blockName": "Rest of CG"
    }
]
```

2. SETTING UP RATE MATRIX
------------------------

- MP1 to CG1 Rate:
  POST http://localhost:5000/rates/update
```json
{
    "OriginBlock": "MP1",
    "DestinationBlock": "CG1",
    "Rate": 8
}
```

- MP1 to Rest of CG Rate:
  POST http://localhost:5000/rates/update
```json
{
    "OriginBlock": "MP1",
    "DestinationBlock": "Rest of CG",
    "Rate": 10
}
```

- MP2 to CG1 Rate:
  POST http://localhost:5000/rates/update
```json
{
    "OriginBlock": "MP2",
    "DestinationBlock": "CG1",
    "Rate": 7
}
```

- Verify Rates:
  GET http://localhost:5000/rates
  Expected Response:
```json
[
    {
        "_id": "65f1234567894",
        "OriginBlock": "MP1",
        "DestinationBlock": "CG1",
        "Rate": 8
    },
    {
        "_id": "65f1234567895",
        "OriginBlock": "MP1",
        "DestinationBlock": "Rest of CG",
        "Rate": 10
    },
    {
        "_id": "65f1234567896",
        "OriginBlock": "MP2",
        "DestinationBlock": "CG1",
        "Rate": 7
    }
]
```

3. CALCULATING SHIPMENT RATES
---------------------------

- Standard Route (MP1 to CG1):
  POST http://localhost:5000/shipment/calculate-rate
```json
{
    "origin": "MP1",
    "destination": "CG1",
    "weight": 55,
    "invoiceValue": 15000,
    "riskType": "carrier"
}
```
  Expected Response:
```json
{
    "baseFreight": 440,
    "fuelSurcharge": 88,
    "dktCharges": 100,
    "fovCharges": 300,
    "odaCharges": 750,
    "appointmentCharges": 1200,
    "totalCost": 2878
}
```

- ODA2 Route (MP1 to Rest of CG):
  POST http://localhost:5000/shipment/calculate-rate
```json
{
    "origin": "MP1",
    "destination": "Rest of CG",
    "weight": 100,
    "invoiceValue": 25000,
    "riskType": "owner"
}
```
  Expected Response:
```json
{
    "baseFreight": 1000,
    "fuelSurcharge": 200,
    "dktCharges": 100,
    "fovCharges": 50,
    "odaCharges": 1500,
    "appointmentCharges": 1200,
    "totalCost": 4050
}
```

- Minimum Weight Test:
  POST http://localhost:5000/shipment/calculate-rate
```json
{
    "origin": "MP1",
    "destination": "CG1",
    "weight": 30,
    "invoiceValue": 10000,
    "riskType": "carrier"
}
```
  Expected Response:
```json
{
    "error": "Minimum weight should be 40 kg"
}
```

- Invalid Risk Type Test:
  POST http://localhost:5000/shipment/calculate-rate
```json
{
    "origin": "MP1",
    "destination": "CG1",
    "weight": 50,
    "invoiceValue": 10000,
    "riskType": "invalid"
}
```
  Expected Response:
```json
{
    "error": "Risk type must be either 'owner' or 'carrier'"
}
```

NOTES:
------
1. All monetary values are in Indian Rupees (Rs).
2. Weight must be a minimum of 40 kg.
3. Risk type must be either "owner" or "carrier".
4. ODA2 charges apply for "Rest of CG" and "REST of Vidharva" blocks.
5. Each API call should be tested in sequence as shown above.
6. Verify error responses and edge cases.
7. Keep track of created IDs for future reference.

