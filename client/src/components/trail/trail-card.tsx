import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Mountain, TrendingUp } from "lucide-react";
import type { Trail } from "@shared/schema";

interface TrailCardProps {
  trail: Trail;
}

export default function TrailCard({ trail }: TrailCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-sage text-white";
      case "Moderate": return "bg-earth text-white";
      case "Hard": return "bg-red-600 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Calculate approximate distance from user (mock calculation)
  const distanceFromUser = Math.random() * 5 + 0.5; // 0.5 to 5.5 miles

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100" data-testid={`card-trail-${trail.id}`}>
      <img 
        src={trail.imageUrl || "/api/placeholder/400/200"} 
        alt={trail.name}
        className="w-full h-32 object-cover"
        data-testid={`img-trail-${trail.id}`}
      />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-forest" data-testid={`text-trail-name-${trail.id}`}>
            {trail.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-sunset fill-current" />
            <span className="text-sm font-medium" data-testid={`text-trail-rating-${trail.id}`}>
              {trail.rating}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Mountain className="w-3 h-3" />
            <span data-testid={`text-trail-distance-${trail.id}`}>{trail.distance} mi</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span data-testid={`text-trail-elevation-${trail.id}`}>+{trail.elevationGain.toLocaleString()} ft</span>
          </div>
          <Badge className={getDifficultyColor(trail.difficulty)} data-testid={`badge-difficulty-${trail.id}`}>
            {trail.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-3 h-3 text-sage" />
            <span data-testid={`text-distance-from-user-${trail.id}`}>
              {distanceFromUser.toFixed(1)} mi away
            </span>
          </div>
          <Link href={`/trail/${trail.id}`}>
            <Button 
              className="bg-sage hover:bg-sage/90 text-white px-4 py-2 text-sm font-medium"
              data-testid={`button-view-trail-${trail.id}`}
            >
              View Trail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
