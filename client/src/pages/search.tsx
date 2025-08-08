import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import TrailCard from "@/components/trail/trail-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon, Filter } from "lucide-react";
import type { Trail } from "@shared/schema";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("distance");

  const { data: trails = [], isLoading } = useQuery<Trail[]>({
    queryKey: ["/api/trails", searchQuery && { search: searchQuery }],
  });

  const filteredTrails = trails
    .filter((trail) => difficulty === "all" || trail.difficulty === difficulty)
    .sort((a, b) => {
      if (sortBy === "distance") return a.distance - b.distance;
      if (sortBy === "difficulty") {
        const difficultyOrder = { Easy: 1, Moderate: 2, Hard: 3 };
        return (
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        );
      }
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

  return (
    <>
      <AppHeader />

      <main className="pb-20 bg-stone min-h-screen" data-testid="search-main">
        <div className="px-4 py-4">
          {/* Search Header */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search trails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
                data-testid="input-search-trails"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-3">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger
                  className="flex-1 bg-white"
                  data-testid="select-difficulty"
                >
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className="flex-1 bg-white"
                  data-testid="select-sort"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Results */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading trails...</div>
            </div>
          ) : filteredTrails.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600">
                {searchQuery
                  ? "No trails found matching your search."
                  : "No trails available."}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="text-sm text-gray-600 mb-4"
                data-testid="text-results-count"
              >
                {filteredTrails.length} trail
                {filteredTrails.length !== 1 ? "s" : ""} found
              </div>
              {filteredTrails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation currentPage="search" />
    </>
  );
}
