import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import AlertCard from "@/components/trail/alert-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Mountain, TrendingUp, Clock, MapPin, Play, Share2 } from "lucide-react";
import type { Trail, TrailAlert, Review } from "@shared/schema";

export default function TrailDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: trail, isLoading } = useQuery<Trail>({
    queryKey: ["/api/trails", id],
    enabled: !!id,
  });

  const { data: trailAlerts = [] } = useQuery<TrailAlert[]>({
    queryKey: ["/api/trail-alerts/trail", id],
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews/trail", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto bg-white shadow-2xl min-h-screen">
        <AppHeader />
        <div className="p-4 text-center">Loading trail details...</div>
        <BottomNavigation currentPage="" />
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="max-w-sm mx-auto bg-white shadow-2xl min-h-screen">
        <AppHeader />
        <div className="p-4 text-center">Trail not found</div>
        <BottomNavigation currentPage="" />
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-sage text-white";
      case "Moderate": return "bg-earth text-white";
      case "Hard": return "bg-red-600 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <>
      <AppHeader />
      
      <main className="pb-20 bg-stone min-h-screen" data-testid="trail-detail-main">
        {/* Hero Image */}
        <div className="relative">
          <img 
            src={trail.imageUrl || "/api/placeholder/400/200"} 
            alt={trail.name}
            className="w-full h-48 object-cover"
            data-testid="img-trail-hero"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 bg-black/50 text-white hover:bg-black/70"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            ← Back
          </Button>
        </div>

        <div className="px-4 py-4">
          {/* Trail Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-charcoal" data-testid="text-trail-name">
                {trail.name}
              </h1>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-sunset fill-current" />
                <span className="text-sm font-medium" data-testid="text-trail-rating">{trail.rating}</span>
                <span className="text-xs text-gray-500">({trail.reviewCount})</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4" data-testid="text-trail-description">
              {trail.description}
            </p>

            {/* Trail Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Mountain className="w-4 h-4" />
                <span data-testid="text-trail-distance">{trail.distance} mi</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span data-testid="text-trail-elevation">+{trail.elevationGain.toLocaleString()} ft</span>
              </div>
              <Badge className={getDifficultyColor(trail.difficulty)} data-testid="badge-trail-difficulty">
                {trail.difficulty}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button className="flex-1 bg-sage hover:bg-sage/90 text-white" data-testid="button-start-hike">
                <Play className="w-4 h-4 mr-2" />
                Start Hike
              </Button>
              <Button variant="outline" data-testid="button-share-trail">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Trail Alerts */}
          {trailAlerts.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3 text-charcoal">Current Alerts</h2>
              <div className="space-y-3">
                {trailAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 text-charcoal">Recent Reviews</h2>
            
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">No reviews yet. Be the first to review this trail!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <Card key={review.id} data-testid={`card-review-${review.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-sage text-white text-sm">
                            U
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">Hiker</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${
                                    i < review.rating 
                                      ? "text-sunset fill-current" 
                                      : "text-gray-300"
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600" data-testid={`text-review-comment-${review.id}`}>
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              data-testid="button-write-review"
            >
              Write a Review
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation currentPage="" />
    </>
  );
}
