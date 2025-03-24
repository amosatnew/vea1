import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterCategory, SortOption } from "@/types";
import { Search, Filter, SortAsc, X } from "lucide-react";

interface SearchAndFilterProps {
  onSearch: (term: string) => void;
  onSort: (option: SortOption) => void;
  onFilter: (category: FilterCategory, value: string) => void;
  onClearFilters: () => void;
  sortOptions: { value: SortOption; label: string }[];
  filterOptions: Record<FilterCategory, string[]>;
  activeFilters: Record<FilterCategory, string[]>;
  activeSort: SortOption | null;
}

const SearchAndFilter = ({
  onSearch,
  onSort,
  onFilter,
  onClearFilters,
  sortOptions,
  filterOptions,
  activeFilters,
  activeSort,
}: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSortChange = (option: SortOption) => {
    onSort(option);
  };

  const handleFilterChange = (category: FilterCategory, value: string) => {
    onFilter(category, value);
  };

  const countActiveFilters = (): number => {
    return Object.values(activeFilters).reduce(
      (count, filters) => count + filters.length,
      0
    );
  };

  const isFilterActive = (category: FilterCategory, value: string): boolean => {
    return activeFilters[category]?.includes(value) || false;
  };

  return (
    <div className="space-y-4 mb-6 bg-card/60 rounded-xl p-4 backdrop-blur-sm border border-primary/10">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search events, artists, venues..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-muted/40 border-primary/10 pl-10 focus-visible:ring-primary"
          />
        </div>
        <Button
          type="submit"
          variant="default"
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Search
        </Button>
      </form>

      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1 flex items-center border-primary/20 hover:bg-primary/10 hover:text-primary"
          >
            <Filter size={16} />
            <span>Filters</span>
            {countActiveFilters() > 0 && (
              <Badge className="ml-1 bg-primary h-5 w-5 flex items-center justify-center p-0 rounded-full">
                {countActiveFilters()}
              </Badge>
            )}
          </Button>
          {countActiveFilters() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs hover:text-primary hover:bg-primary/10"
              onClick={onClearFilters}
            >
              <X size={14} className="mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground flex items-center">
            <SortAsc size={16} className="mr-1" /> Sort by:
          </span>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeSort === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSortChange(option.value)}
              className={activeSort === option.value
                ? "text-xs bg-primary text-white hover:bg-primary/90"
                : "text-xs hover:bg-primary/10 hover:text-primary"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border mt-2">
          {Object.entries(filterOptions).map(([category, values]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium capitalize">
                {category.replace(/([A-Z])/g, " $1").toLowerCase()}
              </h3>
              <div className="flex flex-wrap gap-1">
                {values.map((value) => (
                  <Badge
                    key={value}
                    variant={
                      isFilterActive(category as FilterCategory, value)
                        ? "default"
                        : "outline"
                    }
                    className={`cursor-pointer ${
                      isFilterActive(category as FilterCategory, value)
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "hover:bg-primary/10 hover:text-primary border-primary/20"
                    }`}
                    onClick={() =>
                      handleFilterChange(category as FilterCategory, value)
                    }
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
