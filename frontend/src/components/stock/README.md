# Stock Components

This directory contains reusable components for stock management functionality.

## Components

### `StockCard.tsx`

A card component that displays individual stock items with:

- Car image display
- Car information (make, model, year, category)
- Stock details (quantity, price, stock ID)
- Status badge with color coding
- Creation date
- Optional notes

**Props:**

```tsx
interface StockCardProps {
  stock: Stock; // Stock object from stockApi
}
```

**Features:**

- Responsive image handling
- Status-based color coding
- Hover effects
- Clean typography hierarchy

### `StockFilters.tsx`

Filtering component for stock search and status filtering:

- Search input for cars, make, model, or reference number
- Status dropdown filter
- Active filter display with clear options
- Responsive design

**Props:**

```tsx
interface StockFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearch: (term: string) => void;
  onStatusFilter: (status: string) => void;
}
```

**Features:**

- Real-time search
- Status filtering
- Active filter indicators
- Clear all filters option

### `StockHeader.tsx`

Page header component with:

- Page title and description
- Quick stats cards (placeholder for future enhancement)
- Icon and branding

**Features:**

- Clean header design
- Stats grid layout
- Consistent with overall design system

### `index.ts`

Export file for easy importing of all stock components:

```tsx
export { StockCard } from "./StockCard";
export { StockFilters } from "./StockFilters";
export { StockHeader } from "./StockHeader";
```

## Usage Examples

### Basic Stock Card

```tsx
import { StockCard } from "./components/stock";

<StockCard stock={stockData} />;
```

### With Filters

```tsx
import { StockFilters } from "./components/stock";

<StockFilters
  searchTerm={searchTerm}
  statusFilter={statusFilter}
  onSearch={handleSearch}
  onStatusFilter={handleStatusFilter}
/>;
```

### Complete Stock Page

```tsx
import { StockCard, StockFilters, StockHeader } from "./components/stock";

<div>
  <StockHeader />
  <StockFilters {...filterProps} />
  <div className="grid">
    {stocks.map((stock) => (
      <StockCard key={stock.id} stock={stock} />
    ))}
  </div>
</div>;
```

## Styling

All components use Tailwind CSS with:

- Consistent spacing and typography
- Responsive design patterns
- Hover states and transitions
- Status-based color schemes
- Clean, modern aesthetics

## Dependencies

- **Lucide React**: For icons
- **Tailwind CSS**: For styling
- **stockApi**: For data types and API integration
