// --- Core Application State Variables ---
let map;
let markersGroup;
let pins = []; // List of all pinned locations
let activeStatus = 'visited'; // Status state for the modal Form
let temporaryClickCoords = null; // Stash coordinates during modal creation

// App Initializations on Window Load
window.onload = function() {
    initMap();
    loadPinsFromStorage();
    renderLogsAndStats();
}

// Initialize Map configured to Sleek Minimalist Dark Matter styles
function initMap() {
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 12,
        zoomControl: false
    });

    // CartoDB Dark Matter map styles
    const darkMatterTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    darkMatterTiles.addTo(map);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    markersGroup = L.layerGroup().addTo(map);

    // Leaflet Map Click Listener: Triggers Modal placement at targeted coordinate
    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        openAddPinModal(lat, lng);
    });
}

// ... existing helper logic (flags & storage management) ...
function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return "🗺️";
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

function guessCountryCode(countryName) {
    if (!countryName) return "";
    const matches = {
        "united states": "US", "usa": "US", "united kingdom": "GB", "uk": "GB", "japan": "JP",
        "france": "FR", "germany": "DE", "italy": "IT", "canada": "CA", "brazil": "BR",
        "australia": "AU", "china": "CN", "india": "IN", "mexico": "MX", "spain": "ES",
        "russia": "RU", "south africa": "ZA", "south korea": "KR", "egypt": "EG", "argentina": "AR",
        "greece": "GR", "turkey": "TR", "switzerland": "CH", "netherlands": "NL", "belgium": "BE",
        "vietnam": "VN", "thailand": "TH", "indonesia": "ID", "philippines": "PH", "singapore": "SG"
    };
    const clean = countryName.trim().toLowerCase();
    return matches[clean] || "";
}

function savePinsToStorage() {
    localStorage.setItem('explorer_pins', JSON.stringify(pins));
}

function loadPinsFromStorage() {
    const stored = localStorage.getItem('explorer_pins');
    if (stored) {
        try {
            pins = JSON.parse(stored);
        } catch (e) {
            console.error("Error decoding storage JSON", e);
            pins = [];
        }
    }
}

function performSearch() {
    const query = document.getElementById('search-input').value;
    if (!query || query.trim() === '') return;

    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '<div class="p-3 text-xs italic text-slate-500">Searching global archives...</div>';
    resultsContainer.classList.remove('hidden');

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = '';
            if (data.length === 0) {
                resultsContainer.innerHTML = '<div class="p-3 text-xs italic text-slate-500">No matching territories found.</div>';
                return;
            }

            data.forEach(item => {
                const displayName = item.display_name;
                const lat = parseFloat(item.lat);
                const lon = parseFloat(item.lon);
                
                const optionBtn = document.createElement('button');
                optionBtn.type = 'button';
                optionBtn.className = 'w-full text-left p-2.5 px-3 text-xs hover:bg-slate-900 text-slate-300 transition-colors block border-b border-slate-900/40 focus:outline-none';
                optionBtn.innerHTML = `<i class="fa-solid fa-location-dot text-teal-400 mr-2"></i>${displayName}`;
                optionBtn.onclick = function() {
                    resultsContainer.classList.add('hidden');
                    document.getElementById('search-input').value = '';
                    map.flyTo([lat, lon], 6, { duration: 1.5 });
                    openAddPinModal(lat, lon, displayName);
                };
                resultsContainer.appendChild(optionBtn);
            });
        })
        .catch(err => {
            resultsContainer.innerHTML = '<div class="p-3 text-xs text-red-400">Search action failed. Check your internet connection.</div>';
            console.error("Search Error:", err);
        });
}

document.addEventListener('click', function(e) {
    const searchContainer = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    if (e.target !== searchContainer && e.target !== resultsContainer) {
        resultsContainer.classList.add('hidden');
    }
});

function openAddPinModal(lat, lng, prefilledName = "") {
    temporaryClickCoords = { lat, lng };
    document.getElementById('modal-lat').innerText = lat.toFixed(5);
    document.getElementById('modal-lng').innerText = lng.toFixed(5);
    
    setModalStatus('visited');

    document.getElementById('modal-city-input').value = 'Locating...';
    document.getElementById('modal-country-input').value = 'Locating...';
    document.getElementById('modal-country-code').value = '';

    document.getElementById('add-pin-modal').classList.remove('hidden');

    if (prefilledName) {
        const parts = prefilledName.split(', ');
        const city = parts[0] || "";
        const country = parts[parts.length - 1] || "";
        document.getElementById('modal-city-input').value = city;
        document.getElementById('modal-country-input').value = country;
        document.getElementById('modal-country-code').value = guessCountryCode(country);
    } else {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data && data.address) {
                    const address = data.address;
                    const city = address.city || address.town || address.village || address.suburb || address.county || "Selected Area";
                    const country = address.country || "International Waters";
                    const countryCode = address.country_code ? address.country_code.toUpperCase() : "";

                    document.getElementById('modal-city-input').value = city;
                    document.getElementById('modal-country-input').value = country;
                    document.getElementById('modal-country-code').value = countryCode;
                } else {
                    throw new Error("No address details");
                }
            })
            .catch(() => {
                document.getElementById('modal-city-input').value = "Selected Coordinate";
                document.getElementById('modal-country-input').value = "Unknown Destination";
                document.getElementById('modal-country-code').value = "";
            });
    }
}

function closeAddPinModal() {
    document.getElementById('add-pin-modal').classList.add('hidden');
    temporaryClickCoords = null;
}

function setModalStatus(status) {
    activeStatus = status;
    const visitedBtn = document.getElementById('btn-status-visited');
    const wishlistBtn = document.getElementById('btn-status-wishlist');

    if (status === 'visited') {
        visitedBtn.className = "border border-teal-500 bg-teal-950/40 text-teal-300 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all focus:outline-none group shadow-[0_0_12px_rgba(20,184,166,0.3)] scale-[1.02]";
        wishlistBtn.className = "border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all focus:outline-none group";
    } else {
        visitedBtn.className = "border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all focus:outline-none group";
        wishlistBtn.className = "border border-violet-500 bg-violet-950/40 text-violet-300 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all focus:outline-none group shadow-[0_0_12px_rgba(139,92,246,0.3)] scale-[1.02]";
    }
}

function saveModalPin() {
    if (!temporaryClickCoords) return;

    const city = document.getElementById('modal-city-input').value.trim() || "Chosen coordinate";
    const country = document.getElementById('modal-country-input').value.trim() || "Explorer Lands";
    let countryCode = document.getElementById('modal-country-code').value.trim().toUpperCase();

    if (!countryCode) {
        countryCode = guessCountryCode(country);
    }

    const flagEmoji = getFlagEmoji(countryCode);

    const newPin = {
        id: Date.now(),
        lat: temporaryClickCoords.lat,
        lng: temporaryClickCoords.lng,
        city: city,
        country: country,
        countryCode: countryCode,
        flag: flagEmoji,
        status: activeStatus
    };

    pins.push(newPin);
    savePinsToStorage();
    renderLogsAndStats();
    closeAddPinModal();
}

function deletePin(id) {
    pins = pins.filter(p => p.id !== id);
    savePinsToStorage();
    renderLogsAndStats();
}

function flyToLocation(lat, lng) {
    map.flyTo([lat, lng], 6, {
        duration: 1.5
    });
}

function renderLogsAndStats() {
    markersGroup.clearLayers();

    const visitedListEl = document.getElementById('visited-list');
    const wishlistListEl = document.getElementById('wishlist-list');

    visitedListEl.innerHTML = '';
    wishlistListEl.innerHTML = '';

    let visitedCount = 0;
    let wishlistCount = 0;
    const visitedCountries = new Set();

    pins.forEach(pin => {
        if (pin.status === 'visited') {
            visitedCount++;
            visitedCountries.add(pin.country);
        } else {
            wishlistCount++;
        }

        const markerClass = pin.status === 'visited' ? 'marker-visited' : 'marker-wishlist';
        const customIcon = L.divIcon({
            className: `explorer-marker ${markerClass}`,
            html: `<span class="text-lg select-none">${pin.flag || '🗺️'}</span>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const marker = L.marker([pin.lat, pin.lng], { icon: customIcon });
        
        const statusLabel = pin.status === 'visited' 
            ? '<span class="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold border border-teal-500/30">VISITED</span>'
            : '<span class="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-bold border border-violet-500/30">WISHLIST</span>';

        const popupContent = `
            <div class="p-2 text-center min-w-[160px]">
                <div class="text-2xl mb-1">${pin.flag}</div>
                <h4 class="font-header text-slate-100 font-bold text-sm leading-tight">${pin.city}</h4>
                <p class="text-xs text-slate-400 mb-2">${pin.country}</p>
                <div class="mb-3">${statusLabel}</div>
                <button onclick="deletePin(${pin.id})" class="text-[10px] text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider flex items-center gap-1 justify-center w-full bg-red-950/20 hover:bg-red-950/40 py-1.5 rounded-lg transition-colors border border-red-900/30">
                    <i class="fa-solid fa-trash-can"></i> Remove Pin
                </button>
            </div>
        `;

        marker.bindPopup(popupContent).addTo(markersGroup);

        // Build modern list elements
        const listLi = document.createElement('li');
        listLi.className = "group flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 hover:border-slate-800 transition-all";
        
        const activeColor = pin.status === 'visited' ? 'hover:text-teal-400' : 'hover:text-violet-400';

        listLi.innerHTML = `
            <button onclick="flyToLocation(${pin.lat}, ${pin.lng})" class="flex-1 text-left flex items-center gap-2 overflow-hidden ${activeColor} focus:outline-none">
                <span class="text-lg flex-shrink-0">${pin.flag}</span>
                <div class="truncate">
                    <p class="font-bold text-xs text-slate-200 truncate leading-tight">${pin.city}</p>
                    <p class="text-[10px] text-slate-500 truncate">${pin.country}</p>
                </div>
            </button>
            <button onclick="deletePin(${pin.id})" class="text-slate-600 hover:text-red-400 p-1 px-1.5 rounded transition-colors" title="Delete Log">
                <i class="fa-solid fa-xmark text-xs"></i>
            </button>
        `;

        if (pin.status === 'visited') {
            visitedListEl.appendChild(listLi);
        } else {
            wishlistListEl.appendChild(listLi);
        }
    });

    // Fallback empty UI layouts
    if (visitedCount === 0) {
        visitedListEl.innerHTML = `<li class="italic text-slate-500 text-xs py-2 px-1">No visited locations pinned yet. Click map or search to add.</li>`;
    }
    if (wishlistCount === 0) {
        wishlistListEl.innerHTML = `<li class="italic text-slate-500 text-xs py-2 px-1">No wishlist destinations added yet. Plan your next adventure.</li>`;
    }

    // Sync metrics and bars
    document.getElementById('visited-stat').innerText = visitedCount;
    document.getElementById('wishlist-stat').innerText = wishlistCount;

    const globalCoveragePercent = Math.min(100, Math.round((visitedCountries.size / 195) * 100));
    document.getElementById('coverage-percentage').innerText = `${globalCoveragePercent}%`;
    document.getElementById('coverage-bar').style.width = `${globalCoveragePercent}%`;
}

// --- Custom Dialog-based Actions to avoid raw alert/confirm UI blocks ---
function clearAllPins() {
    const confirmed = confirm("Are you sure you want to reset your travel logs? This cannot be undone.");
    if (confirmed) {
        pins = [];
        savePinsToStorage();
        renderLogsAndStats();
    }
}

function openBackupModal() {
    const backupText = JSON.stringify(pins);
    document.getElementById('backup-textarea').value = btoa(unescape(encodeURIComponent(backupText)));
    document.getElementById('import-textarea').value = '';
    document.getElementById('backup-modal').classList.remove('hidden');
}

function closeBackupModal() {
    document.getElementById('backup-modal').classList.add('hidden');
}

function copyBackupText() {
    const copyText = document.getElementById("backup-textarea").value;
    navigator.clipboard.writeText(copyText).then(() => {
        const copyBtn = document.querySelector('button[onclick="copyBackupText()"]');
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check text-teal-400"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

function importBackupLogs() {
    const importString = document.getElementById('import-textarea').value.trim();
    if (!importString) {
        return;
    }

    try {
        const decodedText = decodeURIComponent(escape(atob(importString)));
        const parsed = JSON.parse(decodedText);
        
        if (Array.isArray(parsed)) {
            pins = parsed;
            savePinsToStorage();
            renderLogsAndStats();
            closeBackupModal();
        } else {
            throw new Error("Invalid schema");
        }
    } catch (e) {
        console.error("Backup import error", e);
    }
}