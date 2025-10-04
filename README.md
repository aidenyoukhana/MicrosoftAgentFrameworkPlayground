# Microsoft Agent Framework Playground

A playground project for experimenting with Microsoft's Agent Framework, featuring a chat interface powered by Azure OpenAI.

## Architecture

This project consists of two main components:

- **Backend**: ASP.NET Core Web API using Microsoft Agent Framework libraries to create AI-powered chat agents
- **Frontend**: React application built with Vite and TypeScript, providing a modern chat interface

## Features

- Interactive chat interface with conversation history
- AI agent powered by Azure OpenAI GPT models
- Markdown rendering for rich text responses
- Local storage for conversation persistence
- Swagger API documentation in development

## Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- Azure OpenAI resource with a deployed model

## Setup

### Backend Configuration

1. Create a `.env` file in the `backend` directory with your Azure OpenAI settings:

   ```
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_API_KEY=your-api-key-here
   AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
   ```

   Alternatively, you can use Azure CLI authentication by omitting the `AZURE_OPENAI_API_KEY` and ensuring you're logged in with `az login`.

2. Navigate to the backend directory and run the application:

   ```bash
   cd backend
   dotnet run
   ```

   The API will be available at `https://localhost:5001` (or `http://localhost:5000` in development).

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

## Usage

1. Ensure both backend and frontend are running
2. Open the frontend in your browser
3. Start chatting with the AI agent
4. Conversations are automatically saved to local storage

## API Endpoints

- `POST /api/chat` - Send a message to the AI agent
- Swagger UI available at `/swagger` in development

## Technologies Used

- **Backend**: ASP.NET Core, Microsoft Agent Framework, Azure OpenAI
- **Frontend**: React, TypeScript, Vite, Marked (for markdown rendering)

## Contributing

This is a playground project for learning and experimentation. Feel free to modify and extend the functionality.</content>
<filePath>/Users/aiden.youkhana/MicrosoftAgentFrameworkPlayground/README.md