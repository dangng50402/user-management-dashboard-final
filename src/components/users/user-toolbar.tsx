"use client";

import { memo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import type { CityFilter, SortField, SortOrder } from "@/types/user";

interface UserToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  cities: string[];
  filter: CityFilter;
  onFilterChange: (v: CityFilter) => void;
  sortField: SortField;
  onSortFieldChange: (v: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (v: SortOrder) => void;
  onCreateClick: () => void;
  totalCount: number;
  filteredCount: number;
}

export const UserToolbar = memo(function UserToolbar({
  search,
  onSearchChange,
  cities,
  filter,
  onFilterChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  onCreateClick,
  totalCount,
  filteredCount,
}: UserToolbarProps) {
  // Local state cho input — debounce trước khi sync lên URL
  const [inputValue, setInputValue] = useState(search);
  const debouncedValue = useDebounce(inputValue, 400);

  useEffect(() => {
    if (debouncedValue !== search) {
      onSearchChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Tìm kiếm theo tên, email, công ty..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-44">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Lọc theo thành phố" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortField}
          onValueChange={(v) => onSortFieldChange(v as SortField)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Tên</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="company">Công ty</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(v) => onSortOrderChange(v as SortOrder)}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A → Z</SelectItem>
            <SelectItem value="desc">Z → A</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={onCreateClick}
          className="border border-border shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm user
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Hiển thị{" "}
        <span className="font-medium text-foreground">{filteredCount}</span> /{" "}
        {totalCount} users
      </p>
    </div>
  );
});
