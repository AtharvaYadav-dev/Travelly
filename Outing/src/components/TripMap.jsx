import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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
  const [center, setCenter] = useState([46.5, 8.0]); // Default: Switzerland
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    if (itinerary?.location) {
      geocodeLocation(itinerary.location);
    }
  }, [itinerary]);

  const geocodeLocation = async (location) => {
    try {
      // Use Nominatim (OpenStreetMap) for geocoding - free, no API key needed
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCenter([parseFloat(lat), parseFloat(lon)]);

        // Create locations for each day
        const dayLocations = formattedResponse.map((day, index) => ({
          position: [
            parseFloat(lat) + (Math.random() - 0.5) * 0.1, // Slight offset for each day
            parseFloat(lon) + (Math.random() - 0.5) * 0.1
          ],
          title: day.title,
          activities: day.items.slice(0, 3), // First 3 activities
          dayNumber: index + 1
        }));

        setLocations(dayLocations);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
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
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
                  <div className="p-2">
                    <h4 className="font-bold text-lg mb-2">{location.title}</h4>
                    <div className="space-y-1">
                      {location.activities.map((activity, i) => (
                        <p key={i} className="text-sm text-gray-700">
                          • {activity.substring(0, 60)}...
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
