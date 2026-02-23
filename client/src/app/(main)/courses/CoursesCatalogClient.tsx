"use client";

import {
  SlidersHorizontal,
  BookMarked,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

import { CatalogHero } from "@/components/courses/CatalogHero";
import { CourseCard } from "@/components/courses/CourseCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortOptions } from "@/constants/courses";
import { useCategories } from "@/features/course/hooks/useCategories";
import { useCourses } from "@/features/course/hooks/useCourses";
import { CourseFilters as FilterParams } from "@/features/course/services/course.service";
import { ICourse, CoursesResponse } from "@/features/course/types";

// Dynamic import for filter sidebar - non-critical, reduces initial bundle
const FilterSidebar = dynamic(
  () =>
    import("@/components/courses/CourseFilters").then(
      (mod) => mod.CourseFilters,
    ),
  {
    loading: () => (
      <div className="w-64 h-[500px] bg-card border border-border rounded-2xl animate-pulse" />
    ),
  },
);

interface CoursesCatalogClientProps {
  initialCourses: CoursesResponse;
  initialCategories: { id: string; name: string }[];
}

export default function CoursesCatalogClient({
  initialCourses,
  initialCategories,
}: CoursesCatalogClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedSort, setSelectedSort] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState(1000);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const limit = 9;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id);
    setPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setPage(1);
  };

  const sortParams = useMemo(() => {
    switch (selectedSort) {
      case "Newest":
        return { sortBy: "createdAt", sortOrder: "desc" as const };
      case "Price: Low–High":
        return { sortBy: "price", sortOrder: "asc" as const };
      case "Price: High–Low":
        return { sortBy: "price", sortOrder: "desc" as const };
      case "Most Popular":
        return { sortBy: "Most Popular", sortOrder: "desc" as const };
      case "Highest Rated":
        return { sortBy: "Highest Rated", sortOrder: "desc" as const };
      default:
        return { sortBy: "createdAt", sortOrder: "desc" as const };
    }
  }, [selectedSort]);

  const filters: FilterParams = {
    ...(search.trim() ? { searchTerm: search.trim() } : {}),
    ...(selectedCategoryId !== "All" ? { categoryId: selectedCategoryId } : {}),
    ...(selectedLevel !== "All Levels" ? { level: selectedLevel } : {}),
    ...(priceMax !== 1000 ? { maxPrice: priceMax } : {}),
    ...(selectedRating ? { rating: selectedRating } : {}),
    ...(page > 1 ? { page } : {}),
    limit,
    ...sortParams,
  };

  const { data: apiCategories } = useCategories({
    initialData: {
      success: true,
      data: initialCategories,
    },
  });

  const {
    data: coursesResponse,
    isLoading,
    isError,
  } = useCourses(filters, {
    initialData:
      page === 1 &&
      !search &&
      selectedCategoryId === "All" &&
      selectedLevel === "All Levels"
        ? initialCourses
        : undefined,
  });

  const handleClearFilters = () => {
    setSelectedCategoryId("All");
    setSelectedLevel("All Levels");
    setPriceMax(1000);
    setSelectedRating(null);
    setSearch("");
    setPage(1);
  };

  const currentCourses = coursesResponse?.data || [];
  const totalPages = coursesResponse?.meta.totalPage || 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CatalogHero search={search} onSearchChange={handleSearchChange} />

      <h2 className="sr-only">Course Catalog Content</h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-8">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategoryId === "All"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            All
          </button>
          {apiCategories?.map((cat: { id: string; name: string }) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategoryId === cat.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground text-sm">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {coursesResponse?.meta.total || 0}
            </span>{" "}
            courses
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-label={showFilters ? "Hide filters" : "Show filters"}
              aria-expanded={showFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                showFilters
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              Filters
            </button>

            <Select value={selectedSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl bg-card border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {showFilters && (
            <FilterSidebar
              selectedLevel={selectedLevel}
              setSelectedLevel={(val) => {
                setSelectedLevel(val);
                setPage(1);
              }}
              priceMax={priceMax}
              setPriceMax={(val) => {
                setPriceMax(val);
                setPage(1);
              }}
              selectedRating={selectedRating}
              setSelectedRating={(val) => {
                setSelectedRating(val);
                setPage(1);
              }}
              onClear={handleClearFilters}
            />
          )}

          <div className="flex-1 min-w-0">
            {isLoading && !coursesResponse ? (
              <div
                className={`grid gap-5 ${showFilters ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-80 rounded-2xl bg-card border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-24">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Failed to load courses
                </h3>
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary font-bold"
                >
                  Try again
                </button>
              </div>
            ) : currentCourses.length === 0 ? (
              <div className="text-center py-24">
                <BookMarked className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-5 ${
                    showFilters
                      ? "grid-cols-1 lg:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {currentCourses.map((course: ICourse, index: number) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      priority={index < 3} // Only top 3 cards in initial viewport
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      aria-label="Previous page"
                      className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg border text-sm font-bold transition-all ${
                              page === p
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "border-border hover:border-primary/40 hover:text-primary"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      aria-label="Next page"
                      className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
