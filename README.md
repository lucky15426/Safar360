# Safar360 🌍✈️

**Safar360** is a premium, AI-powered travel discovery and planning platform designed for the modern explorer. Built for **VOYAGEHACK 3.0**, this application redefines how people discover, plan, and experience travel by blending immersive technology with intelligent planning tools.

---

## 🚀 Key Features

-   **🌐 360° Immersive Viewer**: Step into breathtaking landmarks and destinations before you book. Experience high-fidelity panoramic tours of global wonders like the Eiffel Tower, Taj Mahal, and more.
-   **🗺️ Smart Itinerary Planner**: Generate personalized travel plans in seconds. Our intelligent engine optimizes your route based on your interests and travel style.
-   **✨ Hidden Gems Discovery**: Uncover secret local spots that aren't on typical tourist maps, complete with stories and community-shared media.
-   **📁 Document Vault**: A secure, integrated wallet for your travel essentials—store tickets, IDs, and PDFs for instant access on the go.
-   **✈️ Live Flight Tracker**: Real-time oceanic/aerial tracking of flights globally with a cinematic interface.
-   **🎒 Trip Checklist**: Never forget an essential again with our smart packing and pre-trip preparation tools.
-   **🤖 Salahkar (AI Travel Guide)**: Your personal AI travel co-pilot powered by Hugging Face NLP models to provide instant local insights and recommendations.
-   **💬 AI Travel Agents**: Interact with specialized AI agents for deep-dive travel planning.
-   **🗺️ Interactive World Maps**: Visual exploration of destinations with real-time OSRM routing and distance calculation.
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
-   **Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
-   **Database**: [Supabase](https://supabase.com/) & [MongoDB](https://www.mongodb.com/) (Document Storage)
-   **Media**: [Cloudinary](https://cloudinary.com/)
-   **AI Engines**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/) & [Hugging Face Inference](https://huggingface.co/inference-api)

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
3.  Create a `.env` file in the root:
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
    VITE_GEMINI_API_KEY=your_gemini_key
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    ```
4.  Start development server:
    ```bash
    npm run dev
    ```

### Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `server/.env` file:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    CLERK_PUBLISHABLE_KEY=your_clerk_key
    CLERK_SECRET_KEY=your_clerk_secret
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```

---

## 🚢 Deployment

The application is optimized for deployment on **Vercel** with a Node.js backend proxy.

-   **GitHub**: [lucky15426/Safar360](https://github.com/lucky15426/Safar360)

---

## 🏆 VOYAGEHACK 3.0 Submission

Developed with passion for **VOYAGEHACK 3.0**, Safar360 aims to bridge the gap between imagination and reality for travelers worldwide.



