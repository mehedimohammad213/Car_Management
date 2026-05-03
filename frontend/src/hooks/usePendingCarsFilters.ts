import { useState, useMemo, useEffect, useCallback } from "react";

const PER_PAGE = 19;

export type PendingCarRecord = Record<string, unknown> & {
  id: number;
  make?: string;
  model?: string;
  year?: number;
  fuel?: string;
  color?: string;
  ref_no?: string;
  chassis_no_full?: string;
  chassis_no_masked?: string;
  status?: string;
};

export function usePendingCarsFilters(availableCars: PendingCarRecord[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, yearFilter, makeFilter, modelFilter, colorFilter, fuelFilter]);

  const derived = useMemo(() => {
    /** All cars returned by the API (no stock row yet). Include sold-status cars so counts match the backend list. */
    const base = [...availableCars];

    let filtered = [...base];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((car) => {
        const make = String(car.make ?? "").toLowerCase();
        const model = String(car.model ?? "").toLowerCase();
        const ref = String(car.ref_no ?? "").toLowerCase();
        const chFull = String(car.chassis_no_full ?? "").toLowerCase();
        const chMask = String(car.chassis_no_masked ?? "").toLowerCase();
        const yr = String(car.year ?? "");
        return (
          make.includes(q) ||
          model.includes(q) ||
          yr.includes(q) ||
          ref.includes(q) ||
          chFull.includes(q) ||
          chMask.includes(q)
        );
      });
    }

    if (yearFilter) {
      filtered = filtered.filter(
        (car) => car.year?.toString() === yearFilter
      );
    }
    if (makeFilter) {
      filtered = filtered.filter((car) => car.make === makeFilter);
    }
    if (modelFilter) {
      filtered = filtered.filter((car) => car.model === modelFilter);
    }
    if (colorFilter) {
      const cf = colorFilter.toLowerCase();
      filtered = filtered.filter(
        (car) => String(car.color ?? "").toLowerCase() === cf
      );
    }
    if (fuelFilter) {
      const ff = fuelFilter.toLowerCase();
      filtered = filtered.filter(
        (car) => String(car.fuel ?? "").toLowerCase() === ff
      );
    }

    const years = new Set<number>();
    const colors = new Set<string>();
    const fuels = new Set<string>();
    base.forEach((car) => {
      if (car.year != null) years.add(car.year);
      if (car.color) colors.add(car.color);
      if (car.fuel) fuels.add(car.fuel);
    });

    const totalPages = Math.max(
      Math.ceil(filtered.length / PER_PAGE),
      1
    );
    const start = (currentPage - 1) * PER_PAGE;
    const paginated = filtered.slice(start, start + PER_PAGE);

    return {
      sourceList: base,
      filteredAll: filtered,
      paginated,
      totalPages,
      totalItems: filtered.length,
      filterOptions: {
        years: Array.from(years).sort((a, b) => b - a),
        colors: Array.from(colors).sort(),
        fuels: Array.from(fuels).sort(),
      },
    };
  }, [
    availableCars,
    searchTerm,
    yearFilter,
    makeFilter,
    modelFilter,
    colorFilter,
    fuelFilter,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPage((p) =>
      p > derived.totalPages ? derived.totalPages : p
    );
  }, [derived.totalPages]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setYearFilter("");
    setMakeFilter("");
    setModelFilter("");
    setColorFilter("");
    setFuelFilter("");
    setCurrentPage(1);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    yearFilter,
    setYearFilter,
    makeFilter,
    setMakeFilter,
    modelFilter,
    setModelFilter,
    colorFilter,
    setColorFilter,
    fuelFilter,
    setFuelFilter,
    currentPage,
    setCurrentPage,
    totalPages: derived.totalPages,
    totalItems: derived.totalItems,
    perPage: PER_PAGE,
    paginatedCars: derived.paginated,
    filteredAllCars: derived.filteredAll,
    sourceCount: derived.sourceList.length,
    filterOptions: derived.filterOptions,
    handleClearFilters,
  };
}
