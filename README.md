# Diary/Notes Application - Dev-Ops Project

A comprehensive full-stack diary application built with Spring Boot and React, featuring a robust DevOps pipeline. This project demonstrates modern software development practices, including infrastructure as code, automated configuration management, containerization, and continuous integration/deployment.

## 🚀 Features
- **Personal Notes Management:** Create, Read, Update, and Delete (CRUD) personal notes.
- **Secure Authentication:** User registration and login functionality.
- **Responsive Frontend:** Modern UI built with React, Vite, and Tailwind CSS.
- **Scalable Backend:** RESTful API powered by Spring Boot and MongoDB.

## 🛠️ Technology Stack

### Core
- **Frontend:** React (19.x), Vite, Tailwind CSS, Axios.
- **Backend:** Java 17, Spring Boot 3.5.x, Spring Data MongoDB, Lombok.
- **Database:** MongoDB (Running in a Docker container).

### DevOps & Infrastructure
- **Infrastructure:** AWS (EC2 Instance) provisioned via **Terraform**.
- **Configuration:** **Ansible** for automated server setup and dependency installation.
- **Containerization:** **Docker** and **Docker Compose** for multi-container orchestration.
- **CI/CD Pipeline:** **Jenkins** (using `pipeline.groovy`) for automated builds, image pushing to Docker Hub, and deployment.

---

## 🏗️ Project Structure
```text
.
├── backend/            # Spring Boot REST API
├── frontend/           # React frontend application
├── terraform/          # Infrastructure as Code (AWS)
├── ansible/            # Server configuration playbooks
├── compose.yml         # Docker Compose orchestration
├── pipeline.groovy     # Jenkins CI/CD pipeline definition
└── LICENSE             # MIT License
```

---

## 🏁 Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17 & Maven (for local backend development)
- Node.js & npm (for local frontend development)
- AWS CLI & Terraform (for infrastructure deployment)
- Jenkins (for CI/CD pipeline execution)

### 💻 Local Development

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/wathsan11/Dev-Ops-Project-Sem-5.git
    cd Dev-Ops-Project-Sem-5
    ```

2.  **Run with Docker Compose:**
    ```bash
    docker compose up -d
    ```
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:8081`
    - MongoDB: `localhost:27017`

### 🚀 Production Deployment (CI/CD)
The deployment is automated via Jenkins. The pipeline follows these stages:
1.  **SCM Checkout:** Pulls the latest code from GitHub.
2.  **Infrastructure:** Provisions/updates AWS EC2 via Terraform.
3.  **Configuration:** Sets up the EC2 instance using Ansible.
4.  **Build:** Packages the backend (Maven) and frontend.
5.  **Dockerize:** Builds and pushes images to Docker Hub.
6.  **Deploy:** Pulls and starts containers on the EC2 instance using Docker Compose.

---

## 📜 License
This project is licensed under the MIT License - see the `LICENSE` file for details.