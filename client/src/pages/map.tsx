import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function Map() {
  return (
    <>
      <AppHeader />
      
      <main className="pb-20 bg-stone min-h-screen" data-testid="map-main">
        <div className="p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-16 h-16 text-sage mx-auto mb-4" />
              <h2 className="text-xl font-bold text-charcoal mb-2">Interactive Map</h2>
              <p className="text-gray-600">
                Interactive trail map with real-time events and trail markers would be displayed here.
                Integration with mapping services like Leaflet or Mapbox would show:
              </p>
              <ul className="text-left mt-4 space-y-2 text-sm text-gray-600">
                <li>• Trail routes and waypoints</li>
                <li>• Real-time event markers (wildlife, hazards)</li>
                <li>• User location and tracking</li>
                <li>• Elevation profiles</li>
                <li>• Trail difficulty indicators</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation currentPage="map" />
    </>
  );
}
