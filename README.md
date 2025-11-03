# 📚 Grammo

**Your translation & grammar assistant**

Grammo is a full-stack web application that provides AI-powered translation and grammar correction services. Built with React and Django, it offers an intuitive chat interface for language assistance.

## Features

- 🌐 **Translation** - Get accurate translations between languages
- ✏️ **Grammar Correction** - Fix grammar, spelling, and punctuation errors
- 🎭 **Customizable Modes** - Switch between Default and Grammar modes
- 💬 **Tone Control** - Choose between Default, Formal, or Casual tones
- 💾 **Session Management** - Maintain conversation context across messages
- 📱 **Progressive Web App** - Installable PWA with offline support
- 🎨 **Modern UI** - Clean, responsive interface built with React and TypeScript

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **React Markdown** for formatted responses
- **Vite PWA Plugin** for Progressive Web App support

### Backend
- **Django 5.2.7** with Django REST Framework
- **LangChain** for AI agent orchestration
- **HuggingFace** (GPT-OSS-Safeguard-20B) for language model
- **LangGraph** for conversation management

## Prerequisites

- **Python 3.14+**
- **Node.js** (for pnpm/npm)
- **pnpm** (or npm/yarn)
- **HuggingFace API Token** - Get one from [HuggingFace](https://huggingface.co/settings/tokens)

## Installation

### 1. Clone the repository

**Important:** This repository uses Git submodules. Clone with the `--recursive` flag to automatically initialize submodules:

```bash
git clone --recursive <repository-url>
cd grammo
```

**If you already cloned without `--recursive`**, initialize and update submodules:

```bash
git submodule update --init --recursive
```

**To update submodules to their latest commits:**

```bash
git submodule update --remote
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a `.env` file from the example template
cp .env.example .env
# Edit .env and fill in your values (see Environment Variables section below)
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
pnpm install
# Or: npm install / yarn install
```

## Environment Variables

Create a `.env` file in the `backend` directory. You can copy `.env.example` as a template:

```bash
cp backend/.env.example backend/.env
```

Then edit `.env` and fill in your values. The following are the **required** variables:

```env
# Required Settings
SECRET_KEY=your-secret-key-here  # Generate: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
HUGGINGFACEHUB_API_TOKEN=your-huggingface-api-token  # Get from https://huggingface.co/settings/tokens

# Development Settings (defaults shown)
DEBUG=True
SESSION_COOKIE_SECURE=False  # Set to True in production (requires HTTPS)
CSRF_COOKIE_SECURE=False  # Set to True in production (requires HTTPS)
CORS_ALLOW_ALL_ORIGINS=True  # Set to False in production
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional: Production Security Settings
# ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
# SECURE_SSL_REDIRECT=True
# SECURE_CONTENT_TYPE_NOSNIFF=True
# SECURE_HSTS_SECONDS=31536000
# SECURE_HSTS_INCLUDE_SUBDOMAINS=True
# SECURE_HSTS_PRELOAD=True
```

**For detailed documentation on all environment variables, see `backend/.env.example`**

For the frontend, create a `.env` file in the `frontend` directory:

```env
VITE_API_PROXY=http://localhost:8000
```

## Running the Application

### Start the Backend

**Development (with warning):**
```bash
cd backend
source venv/bin/activate  # If not already activated
python manage.py runserver
```

**Development (production-like server - no warning):**
```bash
cd backend
source venv/bin/activate  # If not already activated
uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --reload
```

The backend will run on `http://localhost:8000`

### Start the Frontend

```bash
cd frontend
pnpm dev
# Or: npm run dev / yarn dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken)

### Build for Production

**Frontend:**
```bash
cd frontend
pnpm build
# Or: npm run build / yarn build
```

The production build will be in the `frontend/dist` directory.

**Backend:**
```bash
cd backend
# Set DEBUG=False and SESSION_COOKIE_SECURE=True in .env
python manage.py collectstatic  # If using static files

# Run with production ASGI server:
uvicorn backend.asgi:application --host 0.0.0.0 --port 8000

# Or for production with multiple workers:
uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### `GET /api/v1/hello/`
Health check endpoint that returns a greeting message.

**Response:**
```json
{
  "message": "Hello from Grammo!"
}
```

### `POST /api/v1/chat/`
Send a message to start or continue a chat session.

**Request Body:**
```json
{
  "message": "Translate this text",
  "chatSession": 0,
  "mode": "default",
  "tone": "default"
}
```

**Response:**
```json
{
  "status": "success",
  "response": "Markdown formatted response..."
}
```

### `POST /api/v1/end/`
End the current chat session and clear conversation history.

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "message": "Session ended successfully"
}
```

## Git Submodules

This repository uses Git submodules for the backend component. The `backend` directory is a separate repository that tracks its own version history.

### Working with Submodules

**Initial Setup:**
- Always clone with `--recursive` to get submodules automatically
- Or run `git submodule update --init --recursive` after cloning

**Updating Submodules:**
- Update all submodules to their latest commits: `git submodule update --remote`
- Update submodules to the commit specified in the parent repo: `git submodule update`

**Switching Branches:**
- After switching branches that change submodule commits, run: `git submodule update --init --recursive`

**Making Changes to Submodules:**
- Navigate into the submodule directory (e.g., `cd backend`)
- Make your changes and commit them in the submodule repository
- Go back to the parent repository and commit the submodule reference update

For more information, see [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

## Project Structure

```
grammo/
├── backend/                # Git submodule - Django backend API
│   ├── agent_manager/      # AI agent management and LangChain integration
│   ├── api/                # Django REST API views and URLs
│   ├── backend/            # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md           # See backend/README.md for backend-specific docs
├── frontend/
│   ├── src/
│   │   ├── components/     # React components (Chat, Dropdown)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets and PWA files
│   └── package.json
├── .gitmodules             # Git submodule configuration
└── README.md               # This file
```

## Development

### Backend Development

- The Django app uses SQLite by default (good for development)
- Session management is handled via Django's cache backend (in-memory)
- AI agents are managed per session using LangGraph checkpoints
- The structured output model ensures consistent JSON responses

### Frontend Development

- Uses Vite for fast HMR (Hot Module Replacement)
- TypeScript for type safety
- React Markdown for rendering formatted AI responses
- LocalStorage for persisting user preferences (mode, tone)

## Deployment to Hugging Face Spaces

The backend includes a Dockerfile for easy deployment to Hugging Face Spaces.

### Setup Instructions

1. **Create a new Space** on Hugging Face:
   - Go to https://huggingface.co/spaces
   - Create a new Space
   - Select "Docker" as the SDK

2. **Configure Environment Variables** in your Space settings:
   - `SECRET_KEY`: Your Django secret key (generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
   - `HUGGINGFACEHUB_API_TOKEN`: Your Hugging Face API token
   - `DEBUG`: Set to `False` for production
   - `ALLOWED_HOSTS`: Your Space domain (e.g., `your-space-name.hf.space`)
   - `CORS_ALLOW_ALL_ORIGINS`: Set to `False` for production
   - `CSRF_TRUSTED_ORIGINS`: Include your Space URL (e.g., `https://your-space-name.hf.space`)
   - `SESSION_COOKIE_SECURE`: Set to `True` (Spaces use HTTPS)
   - `CSRF_COOKIE_SECURE`: Set to `True`

3. **Push your code** to the Space repository:
   ```bash
   git clone https://huggingface.co/spaces/your-username/your-space-name
   cd your-space-name
   # Copy the backend directory contents
   # Commit and push
   ```

4. **The Dockerfile** will automatically:
   - Install all dependencies
   - Run database migrations
   - Start the server on port 7860

The API will be available at `https://your-space-name.hf.space/api/v1/`

## Notes

- The application uses in-memory session storage for development. For production, consider using Redis for session and cache management.
- The HuggingFace model (`openai/gpt-oss-safeguard-20b`) is used for language processing.
- CORS is configured to allow cross-origin requests. Configure properly for production.
- The PWA features allow the app to be installed on mobile devices and work offline (with cached assets).

## License

See the [LICENSE](LICENSE) file for details.

