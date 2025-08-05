import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Square } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Activity } from "@shared/schema";

interface ActiveTrackingCardProps {
  activity: Activity;
}

export default function ActiveTrackingCard({ activity }: ActiveTrackingCardProps) {
  const [duration, setDuration] = useState(activity.duration);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update duration every minute for active activities
  useState(() => {
    if (activity.isActive) {
      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  });

  const pauseHikeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/activities/${activity.id}`, {
        isActive: false,
        endTime: new Date().toISOString(),
        duration: duration
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities/active"] });
      toast({
        title: "Hike Paused",
        description: "Your hiking session has been paused.",
      });
    },
  });

  const stopHikeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/activities/${activity.id}`, {
        isActive: false,
        endTime: new Date().toISOString(),
        duration: duration
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/user"] });
      toast({
        title: "Hike Completed",
        description: "Great job! Your hike has been saved.",
      });
    },
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-r from-sage to-forest text-white rounded-xl p-4 shadow-lg" data-testid="active-tracking-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg" data-testid="text-current-hike-title">Current Hike</h3>
        <Badge className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
          LIVE
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <div className="text-2xl font-bold" data-testid="text-current-distance">
            {activity.distance.toFixed(1)}
          </div>
          <div className="text-sm opacity-90">Miles</div>
        </div>
        <div>
          <div className="text-2xl font-bold" data-testid="text-current-elevation">
            {activity.elevationGain.toLocaleString()}
          </div>
          <div className="text-sm opacity-90">Ft Gained</div>
        </div>
        <div>
          <div className="text-2xl font-bold" data-testid="text-current-duration">
            {formatDuration(duration)}
          </div>
          <div className="text-sm opacity-90">Hours</div>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button 
          className="flex-1 bg-white text-forest hover:bg-gray-100 py-2 rounded-lg font-semibold"
          onClick={() => pauseHikeMutation.mutate()}
          disabled={pauseHikeMutation.isPending}
          data-testid="button-pause-hike"
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
        <Button 
          className="flex-1 bg-sunset hover:bg-sunset/90 py-2 rounded-lg font-semibold"
          onClick={() => stopHikeMutation.mutate()}
          disabled={stopHikeMutation.isPending}
          data-testid="button-stop-hike"
        >
          <Square className="w-4 h-4 mr-2" />
          Finish
        </Button>
      </div>
    </Card>
  );
}
