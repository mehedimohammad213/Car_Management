import { Car, Order, Brand, Category, SalesReport } from "../types";

// Sample car brands
export const brands: Brand[] = [
  {
    id: "1",
    name: "Toyota",
    logo: "https://via.placeholder.com/100x50?text=Toyota",
  },
  { id: "2", name: "BMW", logo: "https://via.placeholder.com/100x50?text=BMW" },
  {
    id: "3",
    name: "Tesla",
    logo: "https://via.placeholder.com/100x50?text=Tesla",
  },
  {
    id: "4",
    name: "Mercedes",
    logo: "https://via.placeholder.com/100x50?text=Mercedes",
  },
  {
    id: "5",
    name: "Audi",
    logo: "https://via.placeholder.com/100x50?text=Audi",
  },
  {
    id: "6",
    name: "Honda",
    logo: "https://via.placeholder.com/100x50?text=Honda",
  },
];

// Sample car categories
export const categories: Category[] = [
  { id: "1", name: "SUV", description: "Sport Utility Vehicle" },
  { id: "2", name: "Sedan", description: "Four-door passenger car" },
  { id: "3", name: "Electric", description: "Electric vehicles" },
  { id: "4", name: "Luxury", description: "Premium luxury vehicles" },
  { id: "5", name: "Sports", description: "High-performance sports cars" },
];

// Sample cars data
export const cars: Car[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    category: "Sedan",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 15000,
    description: "Reliable and fuel-efficient sedan with modern features.",
    features: [
      "Bluetooth",
      "Backup Camera",
      "Lane Departure Warning",
      "Apple CarPlay",
    ],
    stock: 5,
    isAvailable: true,
  },
  {
    id: "2",
    brand: "BMW",
    model: "X5",
    year: 2023,
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    category: "SUV",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 8000,
    description: "Luxury SUV with premium features and excellent performance.",
    features: [
      "Leather Seats",
      "Panoramic Sunroof",
      "Premium Sound System",
      "Navigation",
    ],
    stock: 3,
    isAvailable: true,
  },
  {
    id: "3",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    mileage: 5000,
    description: "Electric sedan with cutting-edge technology and long range.",
    features: [
      "Autopilot",
      "Supercharging",
      "Glass Roof",
      "Minimalist Interior",
    ],
    stock: 8,
    isAvailable: true,
  },
  {
    id: "4",
    brand: "Mercedes",
    model: "C-Class",
    year: 2023,
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop",
    category: "Luxury",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 12000,
    description: "Luxury sedan with elegant design and advanced technology.",
    features: [
      "MBUX System",
      "Ambient Lighting",
      "Premium Audio",
      "Driver Assistance",
    ],
    stock: 4,
    isAvailable: true,
  },
  {
    id: "5",
    brand: "Audi",
    model: "A4",
    year: 2023,
    price: 42000,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    category: "Sedan",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 9000,
    description:
      "Premium sedan with quattro all-wheel drive and sophisticated design.",
    features: [
      "Quattro AWD",
      "Virtual Cockpit",
      "MMI Navigation",
      "Bang & Olufsen Sound",
    ],
    stock: 6,
    isAvailable: true,
  },
  {
    id: "6",
    brand: "Honda",
    model: "CR-V",
    year: 2023,
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    category: "SUV",
    fuelType: "Hybrid",
    transmission: "CVT",
    mileage: 11000,
    description:
      "Reliable SUV with excellent fuel economy and spacious interior.",
    features: [
      "Honda Sensing",
      "Apple CarPlay",
      "Android Auto",
      "Power Tailgate",
    ],
    stock: 7,
    isAvailable: true,
  },
  {
    id: "7",
    brand: "Tesla",
    model: "Model Y",
    year: 2023,
    price: 52000,
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    mileage: 3000,
    description: "Electric SUV with impressive range and performance.",
    features: ["Autopilot", "Supercharging", "Glass Roof", "7-Seat Option"],
    stock: 4,
    isAvailable: true,
  },
  {
    id: "8",
    brand: "BMW",
    model: "3 Series",
    year: 2023,
    price: 48000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    category: "Sports",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 7000,
    description: "Sporty sedan with dynamic handling and premium features.",
    features: [
      "Sport Mode",
      "M Sport Package",
      "iDrive 7.0",
      "Live Cockpit Professional",
    ],
    stock: 5,
    isAvailable: true,
  },
];

// Sample orders data
export const orders: Order[] = [
  {
    id: "1",
    userId: "2",
    items: [
      {
        carId: "1",
        car: cars[0],
        quantity: 1,
        price: 25000,
      },
    ],
    status: "delivered",
    totalAmount: 25000,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
    shippingAddress: "123 Main St, City, State 12345",
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    userId: "2",
    items: [
      {
        carId: "3",
        car: cars[2],
        quantity: 1,
        price: 45000,
      },
    ],
    status: "shipped",
    totalAmount: 45000,
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-05T11:30:00Z",
    shippingAddress: "456 Oak Ave, City, State 12345",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "3",
    userId: "2",
    items: [
      {
        carId: "2",
        car: cars[1],
        quantity: 1,
        price: 65000,
      },
    ],
    status: "pending",
    totalAmount: 65000,
    createdAt: "2024-02-10T16:45:00Z",
    updatedAt: "2024-02-10T16:45:00Z",
    shippingAddress: "789 Pine Rd, City, State 12345",
    paymentMethod: "Credit Card",
  },
];

// Sample sales report data
export const salesReport: SalesReport = {
  totalSales: 135000,
  totalOrders: 3,
  monthlySales: [
    { month: "Jan", sales: 25000, orders: 1 },
    { month: "Feb", sales: 110000, orders: 2 },
  ],
  topSellingCars: [
    { car: cars[2], totalSold: 1, revenue: 45000 },
    { car: cars[1], totalSold: 1, revenue: 65000 },
    { car: cars[0], totalSold: 1, revenue: 25000 },
  ],
  topSellingBrands: [
    { brand: "Tesla", totalSold: 1, revenue: 45000 },
    { brand: "BMW", totalSold: 1, revenue: 65000 },
    { brand: "Toyota", totalSold: 1, revenue: 25000 },
  ],
};

// Mock API functions
export const mockApi = {
  // Car related
  getCars: (): Promise<Car[]> => Promise.resolve(cars),
  getCar: (id: string): Promise<Car | undefined> =>
    Promise.resolve(cars.find((car) => car.id === id)),

  // Order related
  getOrders: (): Promise<Order[]> => Promise.resolve(orders),
  getOrder: (id: string): Promise<Order | undefined> =>
    Promise.resolve(orders.find((order) => order.id === id)),

  // Brand and Category
  getBrands: (): Promise<Brand[]> => Promise.resolve(brands),
  getCategories: (): Promise<Category[]> => Promise.resolve(categories),

  // Reports
  getSalesReport: (): Promise<SalesReport> => Promise.resolve(salesReport),

  // Simulate API delay
  delay: (ms: number = 500) =>
    new Promise((resolve) => setTimeout(resolve, ms)),
};
