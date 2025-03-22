# Budget Tracking Application

## Overview
The Budget Tracking Application is an intelligent financial management system that helps users track their income and expenses. Leveraging Google's Gemini AI, the application provides personalized budget recommendations based on users' financial data.

## Features
- Track income and expenses
- Categorize spending
- Visualize financial data through interactive charts
- Generate AI-powered budget recommendations
- Set financial goals and track progress
- Receive insights on spending patterns

## Technologies
- **Backend**: Java Spring Boot
- **Frontend**: React.js
- **AI Integration**: Google Gemini LLM
- **Database**: MongoDB

## Getting Started

### Prerequisites
- Java JDK 11 or higher
- Node.js and npm
- Maven
- MongoDB (local or cloud instance)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd ./BE/
   ```
2. Install dependencies and build the project:
   ```
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```
   The backend server will start on http://localhost:8080

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd ./FE/
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React development server:
   ```
   npm start
   ```
   The frontend application will be available at http://localhost:3000

## Usage
1. Create an account or login
2. Add your income sources and recurring expenses
3. Track daily spending by adding transactions
4. View generated reports and AI recommendations for budget optimization
5. Set financial goals and monitor your progress

## AI-Powered Budget Analysis
Auto Budget utilizes Google's Gemini LLM to analyze user financial data and provide:
- Spending pattern insights
- Budget optimization recommendations
- Financial goal suggestions
- Personalized saving strategies

## Project Team
This application was developed for SENG 401 at the University of Calgary by:
- Samuel Laquerre
- Ahron Ramos
- Paulo Pineda
- Grazia Mena
- Jolie Jony
- Maliha Chowdhury Adrita
