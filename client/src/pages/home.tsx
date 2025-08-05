import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import ActiveTrackingCard from "@/components/trail/active-tracking-card";
import TrailCard from "@/components/trail/trail-card";
import AlertCard from "@/components/trail/alert-card";
import EventReportModal from "@/components/modals/event-report-modal";
import StartHikeModal from "@/components/modals/start-hike-modal";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Play } from "lucide-react";
import type { Trail, Activity, TrailAlert } from "@shared/schema";

const MOCK_USER_ID = "user1";

export default function Home() {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showStartHikeModal, setShowStartHikeModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to NYC coordinates if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, []);

  const { data: activeActivity } = useQuery<Activity | null>({
    queryKey: ["/api/activities/active", { userId: MOCK_USER_ID }],
    enabled: !!MOCK_USER_ID,
  });

  const { data: nearbyTrails = [] } = useQuery<Trail[]>({
    queryKey: ["/api/trails", userLocation && { lat: userLocation.lat, lng: userLocation.lng, radius: 0.1 }],
    enabled: !!userLocation,
  });

  const { data: activeAlerts = [] } = useQuery<TrailAlert[]>({
    queryKey: ["/api/trail-alerts/active"],
  });

  return (
    <>
      <AppHeader />
      
      <main className="pb-20 bg-stone min-h-screen" data-testid="home-main">
        {/* Active Tracking Card */}
        {activeActivity && (
          <div className="px-4 mt-4">
            <ActiveTrackingCard activity={activeActivity} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="px-4 mt-6">
          <h2 className="font-bold text-xl mb-4 text-charcoal">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-white border-2 border-sage text-forest hover:bg-sage/10"
              onClick={() => {
                // Navigate to nearby trails with geolocation
                window.location.href = "/search";
              }}
              data-testid="button-find-nearby"
            >
              <MapPin className="w-6 h-6 text-sage" />
              <div className="text-center">
                <div className="font-semibold">Find Nearby</div>
                <div className="text-sm text-gray-600">Discover trails</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-white border-2 border-mountain-blue text-forest hover:bg-mountain-blue/10"
              onClick={() => setShowEventModal(true)}
              data-testid="button-report-event"
            >
              <AlertTriangle className="w-6 h-6 text-mountain-blue" />
              <div className="text-center">
                <div className="font-semibold">Report Event</div>
                <div className="text-sm text-gray-600">Alert others</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Trail Alerts */}
        {activeAlerts.length > 0 && (
          <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl text-charcoal">Trail Alerts</h2>
              <span className="text-sm text-sage cursor-pointer" data-testid="link-view-all-alerts">View All</span>
            </div>
            
            <div className="space-y-3">
              {activeAlerts.slice(0, 3).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Nearby Trails */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-charcoal">Nearby Trails</h2>
            <Button 
              variant="link" 
              className="text-sm text-sage p-0 h-auto"
              onClick={() => window.location.href = "/search"}
              data-testid="button-see-all-trails"
            >
              See All
            </Button>
          </div>

          <div className="space-y-4">
            {nearbyTrails.slice(0, 3).map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg bg-sunset hover:bg-sunset/90 text-white z-10"
        onClick={() => setShowStartHikeModal(true)}
        data-testid="button-start-new-hike"
      >
        <Play className="w-6 h-6" />
      </Button>

      <BottomNavigation currentPage="home" />
      
      <EventReportModal 
        open={showEventModal} 
        onOpenChange={setShowEventModal}
        userLocation={userLocation}
      />
      
      <StartHikeModal
        open={showStartHikeModal}
        onOpenChange={setShowStartHikeModal}
        userId={MOCK_USER_ID}
      />
    </>
  );
}
