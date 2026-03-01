# Safar360 🌍✈️

**Safar360** is a premium, AI-powered travel discovery and planning platform designed for the modern explorer. Built for **VOYAGEHACK 3.0**, this application redefines how people discover, plan, and experience travel by blending immersive technology with intelligent planning tools.

---

## 🚀 Key Features

-   **🌐 360° Immersive Viewer**: Step into breathtaking landmarks with high-fidelity panoramic tours of global wonders like the Eiffel Tower, Taj Mahal, and more.
-   **🌍 VR Views & 3D Exploration**: Fully immersive VR-compatible views and 3D terrain modeling for a realistic "try-before-you-fly" experience.
-   **🗺️ Smart Itinerary Planner**: Generate personalized travel plans in seconds. Our intelligent engine optimizes your route based on your interests and travel style.
-   **✨ Hidden Gems Discovery**: Uncover secret local spots that aren't on typical tourist maps, complete with stories and community-shared media.
-   **📁 Document Vault (Secure)**: A secure, integrated wallet for your travel essentials—store tickets, IDs, and PDFs with a dedicated backend on **Render**.
-   **✈️ Live Flight Tracker**: Real-time oceanic/aerial tracking of flights globally with a cinematic interface.
-   **🎒 Trip Checklist**: Never forget an essential again with our smart packing and pre-trip preparation tools.
-   **🤖 SafarX Agent**: Your premium AI travel co-pilot featuring:
    -   **AI Chat**: Google Gemini-powered natural language queries.
    -   **Flight Booking**: Real-time search and booking via **TBO API**.
    -   **Hotel Discovery**: Live listings and details via **Rapid API x TripAdvisor**.
    -   **Smart Web Search**: Tavily-integrated discovery for alternative stays & trains.
    -   **Itinerary Gen**: Automated, personalized day-by-day travel planning.
-   **🗺️ Interactive Maps**: Visual exploration of destinations with real-time OSRM routing and distance calculation.
-   **🎵 Global Music Experience**: Ambient sounds and music tailored to your travel exploration.
-   **🤝 Social Groups**: Join or create travel communities to plan group trips and share experiences.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/)
-   **Maps & 3D**: [Leaflet](https://leafletjs.com/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [Mapillary-js](https://www.mapillary.com/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **Data Fetching**: [React Query](https://tanstack.com/query/v3/)
-   **Authentication**: [Clerk](https://clerk.com/)

### Backend & Services
-   **Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) (Deployed on **Render**)
-   **Database**: [Supabase](https://supabase.com/) & [MongoDB](https://www.mongodb.com/)
-   **AI Engines**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/), [FastAPI](https://fastapi.tiangolo.com/), & [Hugging Face](https://huggingface.co/)
-   **APIs**: TBO (Flights), TripAdvisor (Hotels), Tavily (Discovery), [Cloudinary](https://cloudinary.com/) (Media)

---

## 🏗️ Installation & Setup

### Prerequisites
-   Node.js (v20 or higher)
-   npm or yarn
-   MongoDB Atlas account
-   Supabase project
-   Clerk application
-   Cloudinary account
-   Google Gemini API Key

### Frontend Setup
1.  Clone the repository:
    ```bash
    git clone https://github.com/lucky15426/Safar360.git
    cd Safar360
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
### Environment Configuration

#### Frontend (.env)
Create a `.env` in the root directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_API_BASE_URL=http://localhost:5000
VITE_AI_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUD_NAME=your_cloudinary_name
VITE_CLOUD_API_KEY=your_cloudinary_key
VITE_CLOUD_API_SECRET=your_cloudinary_secret
VITE_OPENWEATHER_API_KEY=your_openweather_key
VITE_AVIATION_STACK_API_KEY=your_aviation_stack_key
```

#### Document Vault Backend (server/.env)
Create a `.env` in the `/server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```
4.  Start the backend server:
    ```bash
    npm run dev
    ```

---

## 🚢 Deployment & Status

-   **Frontend**: Deployed on **Vercel**.
-   **Backend (Document Vault)**: Hosted on **Render**.
-   **AI Agent Engine**: Hosted on **Hugging Face Spaces**.
-   **GitHub**: [lucky15426/Safar360](https://github.com/lucky15426/Safar360)

---

## 🏆 VOYAGEHACK 3.0 Submission

Developed with passion for **VOYAGEHACK 3.0**, Safar360 aims to bridge the gap between imagination and reality for travelers worldwide.



