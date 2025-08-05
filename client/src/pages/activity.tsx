import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Activity as ActivityIcon, Mountain, Clock, TrendingUp } from "lucide-react";
import type { Activity } from "@shared/schema";

const MOCK_USER_ID = "user1";

export default function Activity() {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities/user", MOCK_USER_ID],
  });

  const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
  const totalElevation = activities.reduce((sum, activity) => sum + activity.elevationGain, 0);
  const totalTime = activities.reduce((sum, activity) => sum + activity.duration, 0);

  return (
    <>
      <AppHeader />
      
      <main className="pb-20 bg-stone min-h-screen" data-testid="activity-main">
        <div className="px-4 py-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="text-center">
              <CardContent className="p-4">
                <Mountain className="w-6 h-6 text-sage mx-auto mb-2" />
                <div className="text-lg font-bold text-charcoal" data-testid="text-total-distance">
                  {totalDistance.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Miles</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingUp className="w-6 h-6 text-earth mx-auto mb-2" />
                <div className="text-lg font-bold text-charcoal" data-testid="text-total-elevation">
                  {totalElevation.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Ft Gained</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <Clock className="w-6 h-6 text-mountain-blue mx-auto mb-2" />
                <div className="text-lg font-bold text-charcoal" data-testid="text-total-time">
                  {Math.floor(totalTime / 60)}h
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-charcoal">Recent Activities</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading activities...</div>
              </div>
            ) : activities.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ActivityIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Activities Yet</h3>
                  <p className="text-gray-500">Start your first hike to see your activity history here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activities
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((activity) => (
                    <Card key={activity.id} data-testid={`card-activity-${activity.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-charcoal">{activity.name}</CardTitle>
                          {activity.isActive && (
                            <Badge className="bg-green-500 text-white">LIVE</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-charcoal" data-testid={`text-activity-distance-${activity.id}`}>
                              {activity.distance.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-600">Miles</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-charcoal" data-testid={`text-activity-elevation-${activity.id}`}>
                              {activity.elevationGain.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600">Ft Gained</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-charcoal" data-testid={`text-activity-duration-${activity.id}`}>
                              {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs text-gray-600">Duration</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation currentPage="activity" />
    </>
  );
}
