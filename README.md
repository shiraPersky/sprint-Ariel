# Sprint Ariel

This project is a full stack application split into two folders:

* **Client/** – a React application using Vite and Tailwind CSS for the UI.
* **Server/** – a Node.js backend built with Express and Prisma.

The system allows managing community members and events while supporting CV upload and LinkedIn profile import.

## Features

- Upload a CV or provide a LinkedIn URL to automatically create a member profile.
- CV text is extracted with `pdfjs-dist` and analysed by OpenAI to populate database fields.
- LinkedIn scraping is powered by Apify to fetch profile details.
- Event management including participant lists and calendar invitations using Resend.
- PostgreSQL database accessed via Prisma ORM.

## Getting Started

1. Install dependencies for both client and server:

   ```bash
   cd Server && npm install
   cd ../Client && npm install
   ```

2. Configure environment variables. Create a `.env` file inside `Server/` with at least:

   ```bash
   DATABASE_URL="postgres://user:password@localhost:5432/dbname"
   OPENAI_API_KEY=your_openai_key
   APIFY_API_TOKEN=your_apify_token
   RESEND_API_KEY=your_resend_key
   PORT=5000 # optional
   ```

   The client uses `Client/.env` to set `VITE_API_BASE_URL` (defaults to `http://localhost:5000`).

3. Run the development servers in separate terminals:

   ```bash
   # start the backend
   cd Server
   npm run dev

   # start the frontend
   cd ../Client
   npm run dev
   ```

4. Visit `http://localhost:5173` to access the React app.

## Folder Overview

```
Client/   # React/Vite frontend
Server/   # Express + Prisma backend
```

See `Client/README.md` for details on the Vite setup.