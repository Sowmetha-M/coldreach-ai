# ColdReach AI

A minimal full-stack AI application for generating professional cold emails and LinkedIn messages.

## Features

- Generate cold emails or LinkedIn messages
- Customizable purpose, recipient role, tone, and context
- AI-powered content generation using OpenRouter
- Clean, responsive UI with Tailwind CSS

## Tech Stack

- Frontend: Next.js (App Router) + Tailwind CSS
- Backend: Next.js API Routes
- AI: OpenAI SDK with OpenRouter (free models)
- Validation: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- OpenRouter API key (free at https://openrouter.ai/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Add the `OPENROUTER_API_KEY` environment variable in Vercel's dashboard.
4. Deploy!

## Usage

1. Select message type (Cold Email or LinkedIn Message).
2. Choose purpose, recipient role, and tone.
3. Provide a short context (1-2 lines about yourself).
4. Click "Generate Message" to get a structured response.

## API

### POST /api/generate

Generates a message based on the provided parameters.

**Request Body:**
```json
{
  "messageType": "Cold Email",
  "purpose": "Job application",
  "recipientRole": "Recruiter",
  "tone": "Formal",
  "context": "I'm a software engineer with 3 years experience..."
}
```

**Response:**
```json
{
  "subject": "Subject line",
  "greeting": "Greeting",
  "body": "Main body",
  "call_to_action": "Call to action",
  "closing": "Closing"
}
```