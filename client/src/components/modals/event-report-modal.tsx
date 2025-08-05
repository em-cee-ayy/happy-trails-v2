import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rabbit, AlertTriangle, Cloud, Camera } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EventReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLocation: { lat: number; lng: number } | null;
}

export default function EventReportModal({ open, onOpenChange, userLocation }: EventReportModalProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const eventTypes = [
    { id: "wildlife", label: "Wildlife Sighting", icon: Rabbit, color: "text-red-600" },
    { id: "hazard", label: "Trail Hazard", icon: AlertTriangle, color: "text-sunset" },
    { id: "weather", label: "Weather Conditions", icon: Cloud, color: "text-mountain-blue" },
    { id: "photo", label: "Photo Opportunity", icon: Camera, color: "text-sage" },
  ];

  const reportEventMutation = useMutation({
    mutationFn: async () => {
      if (!selectedType || !title || !userLocation) {
        throw new Error("Missing required fields");
      }

      return apiRequest("POST", "/api/trail-events", {
        trailId: "trail1", // Would normally get from current trail or selected trail
        userId: "user1", // Would normally get from auth context
        type: selectedType,
        title,
        description,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        severity: selectedType === "wildlife" ? "high" : "medium",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trail-events/recent"] });
      toast({
        title: "Event Reported",
        description: "Thank you for helping keep fellow hikers informed!",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to report event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedType("");
    setTitle("");
    setDescription("");
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm" data-testid="event-report-modal">
        <DialogHeader>
          <DialogTitle className="text-charcoal">Report Trail Event</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Event Type Selection */}
          <div>
            <Label className="text-sm font-medium text-charcoal">Event Type</Label>
            <div className="space-y-2 mt-2">
              {eventTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    className={`w-full justify-start space-x-3 ${
                      selectedType === type.id 
                        ? "bg-sage text-white hover:bg-sage/90" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedType(type.id)}
                    data-testid={`button-event-type-${type.id}`}
                  >
                    <Icon className={`w-4 h-4 ${selectedType === type.id ? "text-white" : type.color}`} />
                    <span>{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-charcoal">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Brief description of the event"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              data-testid="input-event-title"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-charcoal">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Additional details about the event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
              data-testid="textarea-event-description"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClose}
              data-testid="button-cancel-report"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-sage hover:bg-sage/90 text-white"
              onClick={() => reportEventMutation.mutate()}
              disabled={!selectedType || !title || reportEventMutation.isPending}
              data-testid="button-submit-report"
            >
              {reportEventMutation.isPending ? "Reporting..." : "Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
