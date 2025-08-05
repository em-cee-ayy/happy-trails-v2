import { Bell, Mountain, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  return (
    <>
      {/* Status Bar */}
      <div className="bg-forest text-white px-4 py-1 text-xs flex justify-between items-center">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-2 bg-white rounded-sm opacity-60"></div>
          <div className="w-3 h-2 bg-white rounded-sm opacity-80"></div>
          <div className="w-3 h-2 bg-white rounded-sm"></div>
        </div>
      </div>

      {/* App Header */}
      <header className="bg-forest text-white px-4 py-3 flex items-center justify-between" data-testid="app-header">
        <div className="flex items-center space-x-3">
          <Mountain className="w-6 h-6 text-sage" />
          <h1 className="font-bold text-lg">TrailGuide</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="relative text-white hover:bg-forest/80" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-sunset text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-forest/80" data-testid="button-profile-menu">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>
    </>
  );
}
