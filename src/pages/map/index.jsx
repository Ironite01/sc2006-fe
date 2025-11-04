import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { shop as shopApi } from '../../../paths';

// Custom component to update map view
function MapController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}

export default function MapView() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('all');
  const [mapCenter] = useState([1.3521, 103.8198]); // Singapore center

  // Fetch shop data from API
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all shops with their campaigns
        const response = await fetch(`${shopApi.list}?limit=100&page=1`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch shop data');
        }

        const data = await response.json();

        // Transform the data to match our map format
        const transformedShops = data
          .filter(shop => shop.latitude && shop.longitude) // Only shops with coordinates
          .map(shop => {
            const goal = parseFloat(shop.newestCampaignGoal) || 0;
            const currentAmount = parseFloat(shop.newestCampaignCurrentAmount) || 0;
            const healthScore = goal > 0 ? Math.min(currentAmount / goal, 1.0) : 0;

            return {
              shopId: shop.shopId,
              name: shop.name,
              location: shop.location,
              tag: shop.tag,
              latitude: parseFloat(shop.latitude),
              longitude: parseFloat(shop.longitude),
              imageUrl: shop.imageUrl,
              campaign: shop.newestCampaignId ? {
                campaignId: shop.newestCampaignId,
                goal: goal,
                currentAmount: currentAmount,
                status: 'approved'
              } : null,
              healthScore: healthScore,
              intensity: 1 - healthScore
            };
          });

        setShops(transformedShops);
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Get unique tags for filtering
  const tags = ['all', ...new Set(shops.map(shop => shop.tag).filter(Boolean))];

  // Filter shops by selected tag
  const filteredShops = selectedTag === 'all'
    ? shops
    : shops.filter(shop => shop.tag === selectedTag);

  // Get color based on health score (0-1 scale)
  const getHealthColor = (healthScore) => {
    if (healthScore >= 0.7) return '#22c55e'; // Green - healthy
    if (healthScore >= 0.4) return '#eab308'; // Yellow - moderate
    return '#ef4444'; // Red - struggling
  };

  // Get radius based on intensity (larger = more concerning)
  const getMarkerRadius = (intensity) => {
    return 10 + (intensity * 15); // Range: 10-25
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business health map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading map</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50" style={{ paddingTop: '0' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Business Health Map
          </h1>
          <p className="text-gray-600">
            Visualizing business health across Singapore. Red areas need more support, green areas are thriving.
          </p>
        </div>
      </div>

      {/* Map Controls */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Filter by category */}
          <div className="mb-4">
            <label htmlFor="tag-filter" className="font-medium text-gray-700 mr-3">
              Filter by category:
            </label>
            <select
              id="tag-filter"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tags.map(tag => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'All Categories' : tag}
                </option>
              ))}
            </select>
          </div>

          {/* Legend */}
          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-2">Legend:</div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-green-600"></div>
                <span className="text-sm text-gray-700"><strong className="text-green-600">Healthy</strong> (70%+ funded)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-yellow-600"></div>
                <span className="text-sm text-gray-700"><strong className="text-yellow-600">Moderate</strong> (40-70% funded)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-red-600"></div>
                <span className="text-sm text-gray-700"><strong className="text-red-600">Struggling</strong> (&lt;40% funded)</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <div className="font-semibold text-gray-700 mb-2">Statistics:</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-100 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Total Businesses: </span>
                <strong className="text-gray-900">{shops.length}</strong>
              </div>
              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Showing: </span>
                <strong className="text-blue-700">{filteredShops.length}</strong>
              </div>
              <div className="bg-red-50 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Struggling: </span>
                <strong className="text-red-600">
                  {filteredShops.filter(s => s.healthScore < 0.4).length}
                </strong>
              </div>
              <div className="bg-yellow-50 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Moderate: </span>
                <strong className="text-yellow-600">
                  {filteredShops.filter(s => s.healthScore >= 0.4 && s.healthScore < 0.7).length}
                </strong>
              </div>
              <div className="bg-green-50 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Healthy: </span>
                <strong className="text-green-600">
                  {filteredShops.filter(s => s.healthScore >= 0.7).length}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative" style={{ height: 'calc(100vh - 340px)', minHeight: '500px' }}>
        {filteredShops.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
              No businesses found with coordinates. Please add location data to shops.
            </p>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={mapCenter} />

            {filteredShops.map((shop) => (
              <CircleMarker
                key={shop.shopId}
                center={[shop.latitude, shop.longitude]}
                radius={getMarkerRadius(shop.intensity)}
                fillColor={getHealthColor(shop.healthScore)}
                color={getHealthColor(shop.healthScore)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-bold text-lg mb-2">{shop.name}</h3>
                    {shop.imageUrl && (
                      <img
                        src={shop.imageUrl}
                        alt={shop.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <div className="space-y-1 text-sm">
                      <p><strong>Category:</strong> {shop.tag}</p>
                      <p><strong>Location:</strong> {shop.location}</p>

                      {shop.campaign ? (
                        <>
                          <div className="border-t pt-2 mt-2">
                            <p className="font-semibold mb-1">Current Campaign:</p>
                            <p>
                              <strong>Raised:</strong> ${shop.campaign.currentAmount.toLocaleString()} / ${shop.campaign.goal.toLocaleString()}
                            </p>
                            <p>
                              <strong>Progress:</strong> {(shop.healthScore * 100).toFixed(1)}%
                            </p>
                          </div>
                          <a
                            href={`/campaign/${shop.campaign.campaignId}`}
                            className="block mt-2 text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                          >
                            View Campaign
                          </a>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">No active campaign</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
