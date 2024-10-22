# SPEED - Software Practical Empirical Evidence Database (ENSE701 - Group 7)
The Software Practice Empirical Evidence Database (SPEED) is a web-based application designed to collect, moderate, and analyze research articles on Software Engineering practices. It provides a platform for researchers, students, and practitioners to search for relevant literature, contribute new research articles, and analyze existing data for empirical evidence of Software Engineering practices.

### Group W205_07 members:

**[Erick Lao](https://github.com/ErickLao123)**

**[Echo Thomas](https://github.com/Snofolofosoraus)**

**[Jason Alessandro](https://github.com/JasonAlessandro)**

**[Yamin Syed](https://github.com/YaminSyed04)**

## Features
- Users can submit articles for inclusion in the database by providing bibliographic details (title, authors, journal, year, DOI).
- Articles go through a moderation process to ensure quality and relevance.
- Users can search the SPEED database, sort articles by title, author, DOI, etc. and save queries for later use.
- Users can rate articles on a 1-5 star system, and the average rating is displayed.
- Admins can manage and configure the data in SPEED.


## Installation

#### Prerequisites
Ensure you have the following installed:
- Node.js ([Install Node](https://nodejs.org/en/download/package-manager))
- npm (Node package manager) ([Install NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

#### Clone the Repository
   ```
   git clone https://github.com/JasonAlessandro/ENSE701_Group7.git
   ```
#### Install Dependencies
Navigate to the project directory and install the required dependencies for both the frontend and backend:
   ```
   cd frontend 
   npm install
   ```
   ```
   cd backend 
   npm install
   ```
   
#### Run the Application
1. **Frontend**: 
   In a terminal Window: 
    ```
    cd frontend
    npm run dev
    ```

2. **Backend**: 
   In another terminal Window: 
    ```
    cd backend
    npm run dev
    ```
#### Access the Website
With the frontend and backend running, open your browser and navigate to: ```http://localhost:3000```

**Note**: Certain database functionalities may not work as the app requires its own MongoDB instance. You'll need to set up your own MongoDB database by providing the necessary credentials in the `.env` files for both the backend and frontend. Our MongoDB instance requires a username and password, which are not included in this repository for security reasons.

## Environment Setup

### Backend:
Create a `.env` file in the backend directory and add the following MongoDB connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
```
Replace `<username>`, `<password>`, `<cluster-url>`, and `<dbname>` with your MongoDB connection details.

### Frontend:
Create a `.env` file in the frontend directory and add the backend URL for API calls:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8082
```

Once both `.env` files are set up, the application should function as expected.


## Technologies Used

**Frontend**: Next.js

**Backend**: NestJS
-
**Database**: MongoDB


## License

This project is licensed under the [MIT](LICENSE).
