import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Share2, Camera, Award } from "lucide-react";

export default function Profile() {
  // Mock user data
  const user = {
    name: "Trail Explorer",
    username: "@trailexplorer",
    avatar: null,
    stats: {
      trailsCompleted: 24,
      milesHiked: 127.3,
      elevationGained: 18420,
      badges: ["Early Bird", "Peak Seeker", "Wildlife Spotter"]
    }
  };

  return (
    <>
      <AppHeader />
      
      <main className="pb-20 bg-stone min-h-screen" data-testid="profile-main">
        <div className="px-4 py-4">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback className="bg-sage text-white text-xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-charcoal" data-testid="text-user-name">{user.name}</h2>
                  <p className="text-gray-600" data-testid="text-username">{user.username}</p>
                </div>
                <Button variant="outline" size="sm" data-testid="button-edit-profile">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex space-x-3">
                <Button className="flex-1 bg-sage hover:bg-sage/90 text-white" data-testid="button-share-profile">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button variant="outline" className="flex-1" data-testid="button-add-photo">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-charcoal" data-testid="text-trails-completed">
                  {user.stats.trailsCompleted}
                </div>
                <div className="text-sm text-gray-600">Trails Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-charcoal" data-testid="text-miles-hiked">
                  {user.stats.milesHiked}
                </div>
                <div className="text-sm text-gray-600">Miles Hiked</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-charcoal" data-testid="text-elevation-gained">
                  {user.stats.elevationGained.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Ft Elevation</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-sunset mx-auto mb-2" />
                <div className="text-2xl font-bold text-charcoal" data-testid="text-badges-count">
                  {user.stats.badges.length}
                </div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-charcoal">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.stats.badges.map((badge, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-tan text-earth"
                    data-testid={`badge-${index}`}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings Menu */}
          <Card>
            <CardHeader>
              <CardTitle className="text-charcoal">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-left" data-testid="button-privacy-settings">
                Privacy Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left" data-testid="button-notifications">
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left" data-testid="button-help-support">
                Help & Support
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left text-red-600" data-testid="button-sign-out">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation currentPage="profile" />
    </>
  );
}
