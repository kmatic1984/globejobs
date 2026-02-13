# GlobeJobs

A lightweight web app that aggregates global jobs from free job platforms and only returns **non-expired** listings.

## Sources
- Remotive
- Arbeitnow

## Features
- Keyword + location search
- Browser geolocation autofill
- Filters out jobs older than 30 days
- Single API endpoint: `/api/jobs`

## Run
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.


## Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm i -g firebase-tools
```

2. Login and set project:
```bash
firebase login
firebase use <your-project-id>
```

3. Install Cloud Function dependency:
```bash
cd functions && npm install && cd ..
```

4. Deploy Hosting + Function rewrite (`/api/jobs` -> `jobsApi`):
```bash
firebase deploy --only hosting,functions
```

Files added for deployment: `firebase.json`, `.firebaserc`, and `functions/index.js`.
