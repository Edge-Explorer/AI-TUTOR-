# AI Tutor 2.0 | Beast Mode 🚀📘🤖

A professional, containerized AI-powered educational assistant built with **FastAPI**, **React (TS)**, **PostgreSQL**, and **Ollama**.

---

## 🏗️ Architecture

- **Frontend**: Vite + React + TypeScript + Framer Motion (Premium UI/UX)
- **Backend**: FastAPI + SQLAlchemy + JWT Authentication
- **Database**: PostgreSQL (pgAdmin4 included)
- **Migrations**: Alembic
- **AI Engine**: Ollama (Running locally)
- **Containerization**: Docker & Docker Compose

---

## 🚀 Quick Start

### 1. Prerequisites
- **Docker Desktop** installed and running.
- **Ollama** installed and running on your host machine.
- Pull the models:
  ```bash
  ollama pull phi3
  ollama pull gemma:2b
  ```

### 2. Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```bash
cp .env.example .env
```
Update your `POSTGRES_PASSWORD` (e.g., `Neel@1234`).

### 3. Run with Docker
```bash
docker-compose up --build
```

---

## 📁 Project Structure

```text
AI-TUTOR/
├── backend/            # FastAPI, sqlalchemy, alembic
├── frontend/           # Vite, React, Framer Motion
├── docker-compose.yml  # Orchestration
└── legacy_v1/          # Original project backup
```

---

## 🛠️ Tech Stack Details

- **Auth**: Secure JWT-based authentication with password hashing (bcrypt).
- **Service Layer**: Decoupled AI service for modular LLM integration.
- **Styling**: Custom CSS with Glassmorphism and Outfit typography.
- **Network**: Wired with Docker `extra_hosts` to communicate with local Ollama.

---

Built with 🔥 by Karan.
