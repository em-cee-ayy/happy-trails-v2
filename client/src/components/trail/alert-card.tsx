import { formatDistanceToNow } from "date-fns";
import { Snowflake, AlertTriangle, Rabbit, Camera, Cloud } from "lucide-react";
import type { TrailAlert } from "@shared/schema";

interface AlertCardProps {
  alert: TrailAlert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <Snowflake className="w-4 h-4 text-mountain-blue" />;
      case "hazard":
        return <AlertTriangle className="w-4 h-4 text-sunset" />;
      case "wildlife":
        return <Rabbit className="w-4 h-4 text-red-600" />;
      case "photo":
        return <Camera className="w-4 h-4 text-sage" />;
      default:
        return <Cloud className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity) {
      case "danger":
        return "border-red-500";
      case "warning":
        return "border-sunset";
      case "info":
        return "border-mountain-blue";
      default:
        return "border-gray-300";
    }
  };

  const getBackgroundColor = (severity: string) => {
    switch (severity) {
      case "danger":
        return "bg-red-50";
      case "warning":
        return "bg-yellow-50";
      case "info":
        return "bg-blue-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div 
      className={`${getBackgroundColor(alert.severity)} border-l-4 ${getBorderColor(alert.severity)} p-3 rounded-r-lg`}
      data-testid={`alert-card-${alert.id}`}
    >
      <div className="flex items-start space-x-3">
        {getAlertIcon(alert.type)}
        <div className="flex-1">
          <div className="font-semibold text-sm" data-testid={`text-alert-title-${alert.id}`}>
            {alert.title}
          </div>
          <div className="text-xs text-gray-600 mt-1" data-testid={`text-alert-message-${alert.id}`}>
            {alert.message}
          </div>
          <div className="text-xs text-sage mt-1" data-testid={`text-alert-time-${alert.id}`}>
            {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
}
