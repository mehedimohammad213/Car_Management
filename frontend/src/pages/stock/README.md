# Stock Page Structure

This directory contains the stock management page components organized in a clean, modular structure.

## Files

### `StockPage.tsx`

The main stock page component that displays stock items in a card grid layout. Features include:

- Grid display of stock items
- Search and filtering capabilities
- Pagination
- Responsive design

### `index.ts`

Export file for easy importing of the stock page.

## Components Used

The stock page uses the following components from `../../components/stock/`:

- **StockCard**: Displays individual stock items in a card format
- **StockFilters**: Handles search and status filtering
- **StockHeader**: Page header with title and quick stats

## Features

- **Card-based Layout**: Clean, modern card design for each stock item
- **Search & Filtering**: Search by car details and filter by status
- **Responsive Grid**: Adapts to different screen sizes
- **Status Indicators**: Visual status badges with colors and icons
- **Pagination**: Simple pagination for large stock lists
- **Loading States**: Proper loading indicators and empty states

## Usage

```tsx
import { StockPage } from "./pages/stock";

// Use in routing
<Route path="/stock" element={<StockPage />} />;
```

## API Integration

Uses the `stockApi` service to fetch stock data with:

- Search functionality
- Status filtering
- Pagination support
- Real-time data updates

## Styling

Built with Tailwind CSS for consistent, responsive design:

- Clean white cards with subtle shadows
- Status-based color coding
- Hover effects and transitions
- Mobile-first responsive design
