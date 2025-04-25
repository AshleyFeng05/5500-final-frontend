# Food Delivery Application

A full-stack food delivery platform connecting customers, restaurants, and delivery drivers (dashers).

## Overview

This project is a comprehensive food delivery application built with React and TypeScript. The application serves three main user types:
- **Customers** can browse restaurants, place orders, and track deliveries
- **Restaurants** can manage their menus and handle incoming orders
- **Dashers** can accept delivery assignments and update order status

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Redux Toolkit & RTK Query
  - SCSS for styling
  
- **Backend**:
  - Connects to a REST API (at http://localhost:8080 by default)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd 5500-final-frontend
```

2. Install dependencies
```bash
npm install
```

3. (Optional) Create a .env file in the root directory with the following content:
REACT_APP_BASE_API=`<backend-url>`. default url is http://localhost:8080

4. Start the development server
```bash
npm start
``` 
or if you want to run with nodemon
```bash
npm run dev
``` 

The application will be available at http://localhost:3000

Building for Production
```bash
npm run build
```