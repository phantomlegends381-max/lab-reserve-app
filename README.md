# lab-reserve-app
Lab-Reserve is a full-stack MERN application designed to manage shared STEM club resources like 3D printers and telescopes. It features secure user authentication and a dynamic dashboard to track real-time availability. The core engine uses backend validation logic to prevent double-bookings, ensuring database integrity and lab efficiency.

## Vercel Deployment
This project is configured for Vercel to deploy the React frontend from the `client` folder.

- `vercel.json` points Vercel at `client/package.json` for the static build.
- The frontend will be hosted as a static site.

To preview in a browser after deployment:
1. Sign in to Vercel and create a new project.
2. Import this repository.
3. Use the default settings — Vercel will detect the config.
4. After deployment, open the generated Vercel URL in your browser.

> Note: The backend server is currently local. If you want the full API hosted too, I can add serverless API functions or a separate server deployment.
