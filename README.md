# Problem Solver Platform

**Problem Solver Platform** is a collaborative web application designed to enable users to post problems and solutions, vote on solutions, and engage in discussions to solve various issues. The platform is built using the MERN stack (MongoDB, Express, React, Node.js) and incorporates Redux for state management.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Endpoints](#api-endpoints)
6. [Screenshots](#screenshots)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

## Features

- **User Authentication**: Secure user registration and login.
- **Problem Posting**: Users can post problems that need solutions.
- **Solution Submission**: Users can submit solutions to posted problems.
- **Voting System**: Users can vote on solutions, enhancing collaborative problem-solving.
- **Profile Management**: Users can view and manage their profile details.
- **Real-time Updates**: Updates to problems and solutions are reflected in real-time without page reloads.

## Technologies Used

- **Frontend**: React, Redux, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS, Material-UI

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js
- MongoDB

### Clone the Repository

```bash
git clone https://github.com/your-username/problem-solver-platform.git
cd problem-solver-platform
```

### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the backend directory and add the following environment variables:
    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the frontend development server:
    ```bash
    npm start
    ```

The frontend server will run on `http://localhost:3000` and the backend server will run on `http://localhost:5000`.

## Usage

1. **Register**: Create a new account.
2. **Login**: Access your account.
3. **Post a Problem**: Describe the problem you want to solve.
4. **Submit a Solution**: Provide a solution to existing problems.
5. **Vote on Solutions**: Upvote or downvote solutions to highlight the best ones.
6. **View Profile**: Manage your profile information.

## API Endpoints

### Auth

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Login a user.

### Problems

- **GET /api/problems**: Get all problems.
- **POST /api/problems**: Create a new problem.
- **GET /api/problems/:id**: Get a problem by ID.

### Solutions

- **GET /api/solutions/:problemId**: Get all solutions for a problem.
- **POST /api/solutions**: Create a new solution.
- **PUT /api/solutions/:solutionId/vote**: Vote on a solution.

## Screenshots

### Home Page

![Home Page](./screenshots/home.png)

### Problem Page

![Problem Page](./screenshots/problem.png)

### Profile Page

![Profile Page](./screenshots/profile.png)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Project Maintainer**: Your Name

- **Email**: [your-email@example.com](mailto:dips21201@gmail.com)
- **GitHub**: [https://github.com/your-username](https://github.com/DeepaliBhardwaj)
