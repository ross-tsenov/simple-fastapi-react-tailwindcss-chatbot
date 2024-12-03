# README

## Introduction

This project is a web application featuring a FastAPI backend and a React frontend styled with Tailwind CSS. The backend uses a fake Large Language Model (LLM) to generate responses based on chat history. It is designed to be flexible, allowing you to easily introduce an actual LLM in the future. The application is containerized using Docker and orchestrated with Docker Compose for easy setup and deployment.

## Prerequisites

- **Docker**: Ensure that Docker is installed on your system.
- **Docker Compose**: Ensure that Docker Compose is available.

## Setup Instructions

### Running the Application

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ross-tsenov/simple-fastapi-react-tailwindcss-chatbot.git
   cd simple-fastapi-react-tailwindcss-chatbot
   ```

2. **Start the Application**

   In the root directory of the project, run:

   ```bash
   docker compose up
   ```

   This command builds and starts all the services defined in the `docker-compose.yml` file, including the backend, frontend, and the Traefik reverse proxy.

3. **Access the Application**

   Open your web browser and navigate to [http://localhost](http://localhost) to access the frontend of the application.

   Path to the API would be following [http://localhost/api](http://localhost/api).

### Shutting Down the Application

To stop the application and remove the containers, networks, and volumes created by Docker Compose, run:

```bash
docker compose down
```

### Changing the Reverse Proxy Port

If you encounter issues with port `80` (e.g., if it's already in use), you can change the port mapping for the Traefik reverse proxy:

1. **Modify `docker-compose.yml`**

   - Open the `docker-compose.yml` file.
   - Locate the `traefik` service configuration.
   - In the `ports` section, change the host port to a different number (e.g., `8080`):

     ```yaml
     ports:
       - "8050:80"
     ```

2. **Restart the Application**

   After saving the changes, restart the application:

   ```bash
   docker compose down
   docker compose up
   ```

3. **Access the Application on the New Port**

   Open your web browser and navigate to [http://localhost:8050](http://localhost:8050).

## Accessing the Application

- **Frontend URL**: [http://localhost](http://localhost) (or [http://localhost:8050](http://localhost:8050) if you changed the port)
- **Backend Health Check**: [http://localhost/api/health](http://localhost/api/health) (or [http://localhost:8050/api/health](http://localhost:8050/api/health)if you changed the port)

## Integrating an Actual LLM

To introduce an actual LLM into the backend:

1. **Add a New Class Implementation**

   - In `model.py`, create a new class that implements the `LLMModel` protocol.
   - This class should define methods for loading, unloading, and generating predictions using your chosen LLM.

2. **Register the New Model**

   - Add your new model to the `MODEL_REGISTRY` in `model.py`.

3. **Update the Backend Configuration**

   - Specify which LLM to use by updating the backend or frontend configuration to reference your new model's name.

4. **Rebuild and Restart the Backend**

   - After making changes, rebuild the backend Docker image and restart the application:

     ```bash
     docker compose build backend
     docker compose up
     ```
