"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DANCE_STYLES } from "@/lib/constants";
import { Search, X } from "lucide-react";

type EventFiltersProps = {
  cities: string[];
  countries: string[];
};

export function EventFilters({ cities, countries }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/events?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/events");
  };

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("city") ||
    searchParams.has("country") ||
    searchParams.has("eventType") ||
    searchParams.has("dateFrom") ||
    searchParams.has("dateTo");

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search events..."
          className="pl-10"
          defaultValue={searchParams.get("search") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams("search", (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          value={searchParams.get("city") ?? ""}
          onValueChange={(v) => updateParams("city", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("country") ?? ""}
          onValueChange={(v) => updateParams("country", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("eventType") ?? ""}
          onValueChange={(v) => updateParams("eventType", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Dance style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All styles</SelectItem>
            {DANCE_STYLES.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          defaultValue={searchParams.get("dateFrom") ?? ""}
          onChange={(e) => updateParams("dateFrom", e.target.value)}
          placeholder="From date"
        />
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
          <X className="h-3 w-3" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
