import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Map, Search, Activity, User } from "lucide-react";

interface BottomNavigationProps {
  currentPage: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [location] = useLocation();
  
  const navItems = [
    { id: "home", path: "/", icon: Home, label: "Home" },
    { id: "map", path: "/map", icon: Map, label: "Map" },
    { id: "search", path: "/search", icon: Search, label: "Search" },
    { id: "activity", path: "/activity", icon: Activity, label: "Activity" },
    { id: "profile", path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-4 py-2" data-testid="bottom-navigation">
      <div className="flex items-center justify-around">
        {navItems.map(({ id, path, icon: Icon, label }) => {
          const isActive = currentPage === id || (currentPage === "" && location === path);
          
          return (
            <Link key={id} href={path}>
              <Button 
                variant="ghost" 
                className={`flex flex-col items-center py-2 px-1 h-auto ${
                  isActive ? "text-sage" : "text-gray-400"
                }`}
                data-testid={`nav-${id}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
