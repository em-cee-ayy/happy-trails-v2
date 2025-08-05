import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Trail } from "@shared/schema";

interface StartHikeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export default function StartHikeModal({ open, onOpenChange, userId }: StartHikeModalProps) {
  const [selectedTrailId, setSelectedTrailId] = useState("");
  const [customName, setCustomName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trails = [] } = useQuery<Trail[]>({
    queryKey: ["/api/trails"],
  });

  const startHikeMutation = useMutation({
    mutationFn: async () => {
      const selectedTrail = trails.find(t => t.id === selectedTrailId);
      const hikeName = customName || (selectedTrail ? `${selectedTrail.name} Hike` : "Custom Hike");
      
      return apiRequest("POST", "/api/activities", {
        userId,
        trailId: selectedTrailId || null,
        name: hikeName,
        distance: 0,
        elevationGain: 0,
        duration: 0,
        startTime: new Date().toISOString(),
        isActive: true,
        route: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities/active"] });
      toast({
        title: "Hike Started",
        description: "Your hiking session has begun. Happy trails!",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start hike. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedTrailId("");
    setCustomName("");
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm" data-testid="start-hike-modal">
        <DialogHeader>
          <DialogTitle className="text-charcoal">Start New Hike</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Trail Selection */}
          <div>
            <Label className="text-sm font-medium text-charcoal">Select Trail (Optional)</Label>
            <Select value={selectedTrailId} onValueChange={setSelectedTrailId}>
              <SelectTrigger className="mt-1" data-testid="select-trail">
                <SelectValue placeholder="Choose a trail or create custom" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Custom Hike</SelectItem>
                {trails.map((trail) => (
                  <SelectItem key={trail.id} value={trail.id}>
                    {trail.name} ({trail.distance} mi)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Name */}
          <div>
            <Label htmlFor="customName" className="text-sm font-medium text-charcoal">
              Hike Name (Optional)
            </Label>
            <Input
              id="customName"
              placeholder="Enter custom name for this hike"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="mt-1"
              data-testid="input-hike-name"
            />
          </div>

          {/* Info */}
          <div className="bg-sage/10 p-3 rounded-lg">
            <p className="text-sm text-charcoal">
              Your location will be tracked during the hike. You can pause or stop the session at any time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClose}
              data-testid="button-cancel-hike"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-sage hover:bg-sage/90 text-white"
              onClick={() => startHikeMutation.mutate()}
              disabled={startHikeMutation.isPending}
              data-testid="button-start-hike"
            >
              {startHikeMutation.isPending ? "Starting..." : "Start Hike"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
