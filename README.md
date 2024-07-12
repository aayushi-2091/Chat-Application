

# Real-Time Chat Application

This is a real-time chat application built using React for the frontend, Laravel for the backend, and MySQL for the database. It supports real-time messaging with a smooth and responsive user interface.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)


## Features

- Real-time messaging
- User authentication
- profile managing 
- Private messaging
- Responsive design

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- Composer installed
- MySQL server running
- Laravel installed

## Installation

Follow these steps to set up the project locally.

### Backend (Laravel)

1. Clone the repository:

    ```bash
    git clone https://github.com/aayushi-2091/Chat-Application.git
    cd real-time-chat-app/backend
    ```

2. Install dependencies:

    ```bash
    composer install
    ```

3. Copy the `.env` file and configure your database:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your database credentials:

    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```

4. Generate application key:

    ```bash
    php artisan key:generate
    ```

5. Run migrations:

    ```bash
    php artisan migrate
    ```

6. Start the Laravel development server:

    ```bash
    php artisan serve
    ```

### Frontend (React)

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the React development server:

    ```bash
    npm start
    ```

## Usage

To use the application, open your browser and navigate to `http://localhost:3000` for the frontend and `http://localhost:8000` for the backend API.

## Project Structure

```
real-time-chat-app/
├── backend/        # Laravel backend
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   └── tests/
├── frontend/       # React frontend
│   ├── public/
│   ├── src/
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Open a pull request.

