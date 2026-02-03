# The Mustard Seed — AI Bible Study

A small React + Vite application for Bible reading and AI‑assisted study. The app provides a conversational chat UI, a rich ReadBible experience with quick pickers, and simple profile and saved notes pages. Firebase Authentication enables Google sign‑in.

**Key Features**
- **Chat**: Ask questions; chat history persists. See [src/pages/Chat.jsx](the_mustard_seed/src/pages/Chat.jsx).
- **ReadBible**: Browse books, chapters, and verses with Testament/Book/Chapter pickers; add per‑verse favorites; success alerts confirm actions. See [src/pages/ReadBible.jsx](the_mustard_seed/src/pages/ReadBible.jsx).
- **Saved**: View saved notes. See [src/pages/Saved.jsx](the_mustard_seed/src/pages/Saved.jsx).
- **Profile**: Shows Google profile photo; theme toggle; reset dialog preferences. See [src/pages/Profile.jsx](the_mustard_seed/src/pages/Profile.jsx) and [src/context/AuthContext.jsx](the_mustard_seed/src/context/AuthContext.jsx).

**Tech Stack**
- React 19, Vite 7, React Router 7
- Firebase v12 (Auth, optional Analytics)

## Quick Start

**Local development**
```bash
cd the_mustard_seed
npm install
npm run dev
```

Create `.env` with your Firebase Web config:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=optional_measurement_id
```

Firebase init: [src/config/firebase.js](the_mustard_seed/src/config/firebase.js). Google sign‑in: [src/context/AuthContext.jsx](the_mustard_seed/src/context/AuthContext.jsx).

## Deployment (Vercel)

```bash
npm run build
npm run preview
```

- SPA rewrite: [vercel.json](the_mustard_seed/vercel.json) supports deep links.
- Vercel env vars (Production + Preview):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN` (e.g., `your-project-id.firebaseapp.com`)
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID` (optional)
- Firebase Console → Authentication:
  - Enable Google provider.
  - Add deployed hostname(s) to Authorized domains.

## Troubleshooting
- `auth/unauthorized-domain`: Add your Vercel hostname in Firebase → Authentication → Settings → Authorized domains. Confirm env vars are correct.
- Popups blocked: We force account chooser and fall back to redirect; see [src/context/AuthContext.jsx](the_mustard_seed/src/context/AuthContext.jsx).
- Production config placeholders: Diagnostic logs warn in [src/config/firebase.js](the_mustard_seed/src/config/firebase.js).

## Project Structure
- Entry: [src/App.jsx](the_mustard_seed/src/App.jsx), [src/main.jsx](the_mustard_seed/src/main.jsx)
- ReadBible styles: [src/components/readbible/readbible.css](the_mustard_seed/src/components/readbible/readbible.css)
- Auth styles: [src/pages/Auth.css](the_mustard_seed/src/pages/Auth.css)
- Profile styles: [src/pages/profile.css](the_mustard_seed/src/pages/profile.css)

## Contributing
```bash
npm run lint
npm run dev
```
Please keep changes focused and consistent with existing styles.

## License
For educational/demo use; add license terms as needed.
