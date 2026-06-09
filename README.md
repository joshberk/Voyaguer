🧭 Voyageur: Modern Travel Tracker

Voyageur is a sleek, ultra-minimalist dark-mode interactive travel map designed to catalog your global adventures and future wishlist destinations. Built as a single-page, serverless application utilizing Leaflet.js and Tailwind CSS, it preserves all your logs locally and privacy-first in your browser. This makes it incredibly lightweight, highly performant, and perfect for instant hosting on GitHub Pages.

🗺️ Interactive Preview

(Place a screenshot or a GIF of your stunning dark-mode travel map here to showcase it to visitors!)

📌 Table of Contents

🌟 Key Features

🛠️ Built With

🚀 Quick Start & Deployment

Deploying to GitHub Pages

Running Locally

💾 Architecture & Data Storage

Local Storage Safety

Backup & Migration Protocol

🔧 Customization Guide

❓ Troubleshooting & FAQ

📄 License

🌟 Key Features

Sleek Modern Aesthetics: Handcrafted with custom CartoDB Dark Matter vector-styled tile layers, clean modern geometric typography (using Space Grotesk/Inter), glassmorphic sidebars, and custom pulsing SVG ring pins.

Smart Reverse Geocoding: Simply click anywhere on the world map! The application interfaces with open-source reverse-lookup APIs to instantly resolve coordinates into the corresponding city, state, country, and region.

Unified Global Search: Locate remote destinations, major metropolises, or isolated tropical islands instantly with the integrated navigation search bar.

Visual Distinction (Flags & State Colors):

Visited Locations: Emits a glowing Teal/Emerald accent ring, proudly displaying the exact real-time country flag emoji inside the map marker.

Wishlist Locations: Emits a deep Violet/Indigo pulsing beacon, helping you visualize your dream future itineraries.

Privacy-First Local Storage: No database setups, tracking cookies, or mandatory user accounts. Your data belongs entirely to you and remains locally nested inside your browser.

Secure Cloud Backups: Seamlessly export your logs into an encrypted, compact Base64 string. Use it to back up your journeys or import them onto other devices.

Global Travel Statistics: Displays your customized "World Travel Index" featuring total unique visited lands, upcoming wishlist targets, and a computed global coverage percentage tracker.

🛠️ Built With

Mapping Layer: Leaflet.js (Open-source interactive mapping framework)

Styling Engine: Tailwind CSS v3 (Utility-first framework via optimized CDN)

Map Design Base Map: CartoDB Dark Matter

Typography: Google Fonts (Space Grotesk & Inter font families)

Icons: FontAwesome 6.4 (Smooth vector UI iconography)

Geocoding API: OpenStreetMap Nominatim API (Free, open-source geocoding)

🚀 Quick Start & Deployment

Deploying to GitHub Pages

Getting your interactive travel map live on GitHub Pages is 100% free and takes under two minutes:

Create a GitHub Repository:

Go to your GitHub account and create a new public repository (e.g., my-travel-map).

Add Your Code:

Create an index.html file in the root of your newly created repository.

Paste the entire code of your generated application into index.html.

Activate GitHub Pages:

Navigate to the Settings tab of your repository.

Click on Pages in the left-hand navigation sidebar.

Under Build and deployment, set the Source selection to Deploy from a branch.

Select your main branch (typically main or master) and the / (root) folder, then hit Save.

Enjoy Your Map:

In less than a minute, GitHub will display your live URL (e.g., https://<your-username>.github.io/my-travel-map/).

Running Locally

To test features or custom changes on your computer:

Save your code as index.html.

Double-click the file to open it directly in any modern browser (Chrome, Safari, Firefox, Edge). No local server installation needed!

💾 Architecture & Data Storage

[User Interface (Webpage)]
       │             ▲
       ▼             │
[Local Storage]  [OSM Nominatim API (Reverse Lookup)]


Local Storage Safety

Voyageur utilizes the browser's native localStorage API. Because it is bound to your specific browser profile and domain name:

Clearing your browser's site cookies or clear-caching could reset your travel history.

Your data remains strictly local; it will not automatically sync across physical machines or secondary browsers unless you use the export/import backup tool.

Backup & Migration Protocol

To transfer your data to a phone, laptop, or new browser profile:

Click the Backup Logs button on your sidebar dashboard.

Click Copy to Clipboard to grab your unique, securely compiled Base64 database string.

Open your live map URL on the destination device.

Paste the copied code into the Restore Backup String module and click Restore Logs. Your entire traveler dashboard will sync instantly!

🔧 Customization Guide

Because the application is packaged in a clean, modular, single-file framework, you can easily tweak it to match your preference:

Adjusting Zoom Levels: Locate the Map Initialization sequence in the <script> tag and adjust the default zoom parameters:

const map = L.map('map').setView([20, 0], 2.5); // Increase 2.5 to zoom closer initially


Changing the Base Tile Theme: If you prefer light mode or satellite imagery, swap the L.tileLayer URL. For instance, to use CartoDB Positron (light mode), update to:

L.tileLayer('https://{s}[.basemaps.cartocdn.com/light_all/](https://.basemaps.cartocdn.com/light_all/){z}/{x}/{y}{r}.png', { ... });


❓ Troubleshooting & FAQ

Q: The map is grey and pins aren't loading. What is causing this?

A: This typically means you do not have an active internet connection, or your browser is blocking external CDNs. Voyageur pulls open-source map tiles and styling templates on demand. Ensure you are connected to the internet.

Q: How accurate is the geocoding?

A: The app uses the OpenStreetMap Nominatim database, which is highly accurate. If you click on an open water body or an uninhabited border area, it might struggle to return a precise city or town name, in which case it will default to a fallback coordinates pin label.

Q: Can I run this offline?

A: Because it relies on OSM tile requests and Tailwind CDN resources, a persistent network connection is required to render map interfaces and geocode coordinates correctly.

📄 License

This project is open-source and licensed under the MIT License. Feel free to customize, fork, and share your travel maps with the world!
