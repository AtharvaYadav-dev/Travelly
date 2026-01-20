import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons for each day
const createDayIcon = (dayNumber) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #FF7A2D 0%, #FF9D6E 100%);
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(255, 122, 45, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 16px;
        ">${dayNumber}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const TripMap = ({ itinerary, formattedResponse }) => {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState([19.0760, 72.8777]); // Default: Mumbai
  const [zoom, setZoom] = useState(11);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (itinerary?.location) {
      geocodeLocation(itinerary.location);
    }
  }, [itinerary]);

  const geocodeLocation = async (location) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use Nominatim (OpenStreetMap) for geocoding - free, no API key needed
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location + ', India')}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'Travelly App/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const centerCoords = [parseFloat(lat), parseFloat(lon)];
        setCenter(centerCoords);
        setZoom(12);

        // Create locations for each day with realistic offsets
        const dayLocations = formattedResponse.map((day, index) => {
          // Create realistic offsets around the center point
          const angle = (index / formattedResponse.length) * 2 * Math.PI;
          const distance = 0.02 + (index * 0.01); // Increasing distance for each day
          
          return {
            position: [
              centerCoords[0] + Math.cos(angle) * distance,
              centerCoords[1] + Math.sin(angle) * distance
            ],
            title: day.title,
            activities: day.items.slice(0, 3), // First 3 activities
            dayNumber: index + 1
          };
        });

        setLocations(dayLocations);
        setLoading(false);
      } else {
        // Fallback to major Indian cities if geocoding fails
        const fallbackLocations = getFallbackLocations(location);
        setLocations(fallbackLocations);
        setLoading(false);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setError('Unable to load map. Showing default location.');
      
      // Fallback locations
      const fallbackLocations = getFallbackLocations(location);
      setLocations(fallbackLocations);
      setLoading(false);
    }
  };

  const getFallbackLocations = (location) => {
    // Major Indian city coordinates as fallbacks
    const cityCoords = {
      'mumbai': [19.0760, 72.8777],
      'delhi': [28.6139, 77.2090],
      'bangalore': [12.9716, 77.5946],
      'goa': [15.2993, 74.1240],
      'kerala': [9.9312, 76.2673],
      'rajasthan': [26.9124, 75.7873],
      'rishikesh': [30.0869, 78.2676],
      'manali': [32.2292, 77.1887],
      'default': [19.0760, 72.8777] // Mumbai as default
    };

    const locationLower = location.toLowerCase();
    const centerCoords = cityCoords[locationLower] || cityCoords.default;
    
    return formattedResponse.map((day, index) => {
      const angle = (index / formattedResponse.length) * 2 * Math.PI;
      const distance = 0.02 + (index * 0.01);
      
      return {
        position: [
          centerCoords[0] + Math.cos(angle) * distance,
          centerCoords[1] + Math.sin(angle) * distance
        ],
        title: day.title,
        activities: day.items.slice(0, 3),
        dayNumber: index + 1
      };
    });
  };

  const routeCoordinates = locations.map(loc => loc.position);

  return (
    <div className="trip-map-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-glass p-6 rounded-2xl border border-white/10 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              🗺️ Trip Route Map
            </h3>
            <p className="text-sm text-white/60 mt-1">
              Visualize your journey across {itinerary?.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">Total Distance</p>
            <p className="text-xl font-black text-primary">
              {calculateTotalDistance(locations)} km
            </p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-white/20" style={{ height: '500px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full bg-slate-900">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading map...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Day markers */}
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={location.position}
                  icon={createDayIcon(location.dayNumber)}
                >
                  <Popup className="custom-popup">
                    <div className="p-3 min-w-[200px]">
                      <h4 className="font-bold text-lg mb-2 text-gray-800">{location.title}</h4>
                      <div className="space-y-1">
                        {location.activities.map((activity, i) => (
                          <p key={i} className="text-sm text-gray-700">
                            • {activity.split(']')[1]?.substring(0, 60) || activity.substring(0, 60)}...
                          </p>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Route line */}
              {routeCoordinates.length > 1 && (
                <Polyline
                  positions={routeCoordinates}
                  pathOptions={{
                    color: '#FF7A2D',
                    weight: 3,
                    opacity: 0.8,
                    dashArray: '10, 10'
                  }}
                />
              )}

              {/* Area circle around main location */}
              {center && (
                <Circle
                  center={center}
                  radius={5000}
                  pathOptions={{
                    color: '#FF7A2D',
                    fillColor: '#FF7A2D',
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              )}
            </MapContainer>
          )}
          
          {error && (
            <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span className="text-white/60">Day Locations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" style={{ borderTop: '2px dashed #FF7A2D' }}></div>
            <span className="text-white/60">Travel Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary opacity-30"></div>
            <span className="text-white/60">Exploration Area</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculateTotalDistance = (locations) => {
  if (locations.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < locations.length - 1; i++) {
    const [lat1, lon1] = locations[i].position;
    const [lat2, lon2] = locations[i + 1].position;
    total += calculateDistance(lat1, lon1, lat2, lon2);
  }

  return Math.round(total);
};

export default TripMap;
