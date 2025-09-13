# Netflix 2.0

<p align="center">
  <img src="/public/netflix_icon.png" alt="Netflix 2.0 Logo" width="80" height="80">
</p>

<p align="center">
  <strong>🎬 A modern Netflix clone with enhanced features and extensive content library</strong>
</p>

<p align="center">
  <a href="https://netflix-2-0-lac.vercel.app/">🚀 Live Demo</a>
  ·
  <a href="https://github.com/curlos/netflix-2.0/issues">🐛 Report Bug</a>
  ·
  <a href="https://github.com/curlos/netflix-2.0/issues">✨ Request Feature</a>
</p>

---

## 🌟 About The Project

Netflix 2.0 is a responsive streaming platform that enhances the original Netflix experience with a vast collection of movies and TV shows powered by the TMDB API. The platform includes content that even Netflix doesn't have, with advanced filtering, sorting, and subscription management features.

## 📱 Screenshots

<div align="center">

### 🏠 Homepage (Desktop & Mobile)
<div>
  <img src="https://github.com/user-attachments/assets/ec36361f-8614-4ba1-8f79-91e78530b9c7" height="250" /> <img src="https://github.com/user-attachments/assets/8db1486f-7ca6-4c02-8bad-1f30237e432c" height="250" />
</div>
<div>
  <img src="https://github.com/user-attachments/assets/bb578df8-fa85-4929-ac1b-c1da45882169" height="250" /> <img src="https://github.com/user-attachments/assets/21748cac-9c3f-45c8-af1b-1dc29b920e24" height="250" />
</div>

### 🎬 Movies (Desktop & Mobile)
<img src="https://github.com/user-attachments/assets/2dd87bfc-b68d-460d-8b48-6e671c4b1958" height="250" /> <img src="https://github.com/user-attachments/assets/48323362-1896-4ba4-a9a0-36366135b7cc" height="250" />

### 📺 TV Shows (Desktop & Mobile)
<img src="https://github.com/user-attachments/assets/019f5720-d269-4c09-b7ba-c6338552ab00" height="250" /> <img src="https://github.com/user-attachments/assets/bba28725-fd98-4843-ac2b-723cf3d46c31" height="250" />

### 🎭 TV Show Details (Desktop & Mobile)
<img src="https://github.com/user-attachments/assets/32a80f2b-2d17-4df9-914b-aa99373ab1a0" height="250" /> <img src="https://github.com/user-attachments/assets/270ea0c7-5407-403f-aa8a-1632bb2f2e92" height="250" />

### 📹 TV Episode (Desktop & Mobile)
<img src="https://github.com/user-attachments/assets/8006a142-ef28-45ee-bfc0-0ed1659dec7a" height="250" /> <img src="https://github.com/user-attachments/assets/1696294a-8b14-4094-97c9-8674fed47a14" height="250" />

</div>

### ✨ Key Features

- **🎭 Extensive Content Library** - Thousands of movies and TV shows via TMDB API
- **🔍 Advanced Filtering** - Filter by genres, years, and multiple sorting options
- **👤 User Authentication** - Secure login/signup with Firebase Auth
- **💳 Subscription Management** - Three-tier plans (Basic, Standard, Premium) with Stripe integration
- **📱 Responsive Design** - Optimized for all device sizes
- **🎬 Media Details** - Comprehensive movie/TV show pages with trailers, cast, and recommendations
- **📺 TV Episode Viewing** - Full season navigation and episode details

### 🛠 Built With

**Frontend:**
- React 17 with modern hooks and patterns
- Redux Toolkit Query (RTK Query) for state management
- React Router for navigation
- Bootstrap & React Bootstrap for styling
- Firebase Authentication

**Backend:**
- Express.js server for Stripe webhook handling
- TMDB API integration for media content
- Stripe API for subscription management

**Deployment:**
- Vercel (Frontend & Serverless Functions)

## 🏗 Architecture

This is a full-stack web application featuring:
- **Frontend**: React SPA with Redux Toolkit Query for efficient data fetching and caching
- **Backend**: Express.js server handling Stripe webhooks and payment processing
- **Database**: Firebase for user authentication and management
- **External APIs**: TMDB for movie/TV data, Stripe for payments
- **Deployment**: Vercel for both frontend hosting and serverless backend functions

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
