# Smart-task-planner-backend
🧠 Smart Task Planner - Backend API
This repository contains the core Node.js API responsible for AI-powered task generation, data persistence, and secure communication.

🔗 Project Status & Cross-Reference
Component	Status	URL
API Service	LIVE (Render)	https://smart-task-planner-api.onrender.com
Client App	LIVE (Vercel)	https://smart-task-planner-frontend.vercel.app/

Export to Sheets
🛠️ Technical Stack & Dependencies
Framework: Node.js (CommonJS), Express.js

AI Engine: OpenAI SDK (gpt-4o-mini)


Database: MongoDB via Mongoose ORM 

Deployment: Render

Security: Secure CORS Whitelisting (only allows access from the Vercel Frontend domain).

💡 Core Logic: LLM Reasoning
The primary function of this API is to process a user goal and break it down into actionable steps. This satisfies the project objective to use AI reasoning for task breakdown.

Prompt Engineering and Schema
The API uses a specialized prompt to ensure the output is strictly valid and structured JSON.

Prompt Component	Purpose
LLM Model	gpt-4o-mini
Instruction	
"Break down this goal into actionable tasks with suggested deadlines and dependencies." 

Output Schema	Enforced JSON array of objects, ensuring each task includes task, deadline, and depends_on.

Export to Sheets
⚙️ API Endpoints
Method	Endpoint	Description	Evaluation Focus
POST	/generate-plan	Receives goal, generates the task plan, saves it to MongoDB, and returns the result.		
LLM Reasoning, API Design 

GET	/plans	Fetches all previously saved task plans from the MongoDB database, sorted by creation date.		
Code & API Design, Task Storage 


Export to Sheets
🖥️ Local Setup (Backend)
Clone the repository.

Install dependencies: npm install

Create a local environment file: Create a file named key.env in the root of the repository.

Populate key.env:

Bash

# Backend/key.env (DO NOT COMMIT THIS FILE TO GITHUB)
MONGO_URI=mongodb+srv://... # Your MongoDB connection string
OPENAI_API_KEY=sk-...         # Your OpenAI API Key
Run the server: node server.js

# Link for frontend repository
https://github.com/subhashraj-45/smart-task-planner-frontend
