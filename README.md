# CampusGlow

## About 
CampusGlow is a student-focused e-commerce platform designed to provide university students with easy access to academic essentials, room décor, homeware, and daily necessities. The platform combines a modern frontend interface with a secure backend system to allow users to browse products, add items to their cart, and complete a checkout process with a simulated payment system.

The system is divided into two main parts:

Frontend – provides the user interface and shopping experience.

Backend – manages data, orders, and system functionality through APIs and database integration.


## Features

## Front-end
-Product listing page
-Product details view
-Add to cart functionality
-Shopping cart management
-Checkout page
-Responsive design
-User-friendly interface

## Back-end
-REST API for products and orders
-Cart and checkout processing
-Payment simulation system
-Database integration
-Environment-based configuration
-Order confirmation


## Technology used

## Front-end
- HTML
- CSS
- JavaScript
- VS Code Live Server

## Back-end
- Node.js 18+
- MySQL
- Nodemon

## Tools
- GitHub
- VS Studio Code
- Git Bash


## Installation
1. Open GitBash and clone the repository

2. Front-end Setup
   - Open the front-end folder in VS Code
   - Right-click index.html
   - Click 'Open with Live Server'
   - The website will open in your browser
  
3. Back-end Setup
   - Open the back-end folder in the VS Code terminal
   - Install independancies
     npm install
   - Create a .env file inside the backend folder
   - Start the back-end server
     npm run dev
   - The backend will run on
     http://localhost:3000/api
   - Backend API Requirements
   - The frontend expects these endpoints (base URL: http://localhost:3000/api):
     POST /auth/login
     POST /auth/register
     GET /products
     GET /orders
     POST /orders
     POST /payments


   ## Usage
   1. Start the back-end server
   2. Open the front-end using Live Server
   3. Browsw products
   4. Add items to cart
   5. Proceed to checkout
   6. Complete payment
   7. The order will be processed


## Author
Lutfeeya Cupido










  
