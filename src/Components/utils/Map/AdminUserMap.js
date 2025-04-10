import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AdminUserMap = ({ adminLocation, userLocation }) => {
  const [routeCoords, setRouteCoords] = useState([]);

  // Convert GeoJSON format to usable lat/lng
  const userLat = userLocation?.coordinates?.[1];
  const userLng = userLocation?.coordinates?.[0];

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${adminLocation.lng},${adminLocation.lat};${userLng},${userLat}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
        setRouteCoords(coords);
      } catch (err) {
        console.error("Failed to fetch route:", err);
      }
    };

    if (adminLocation && userLat && userLng) fetchRoute();
  }, [adminLocation, userLat, userLng]);

  return (
    <MapContainer
    className="z-0"
      center={[userLat, userLng]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      />

      {/* Admin Marker */}
      <Marker position={[adminLocation.lat, adminLocation.lng]} />

      {/* User Marker */}
      <Marker position={[userLat, userLng]} />

      {/* Route Polyline */}
      {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
    </MapContainer>
  );
};

export default AdminUserMap;
