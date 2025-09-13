import jsPDF from "jspdf";

export interface StockInvoiceItem {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    image_url?: string;
    mileage_km?: number;
  };
  quantity: number;
  price: number;
  code?: string;
  fob_value_usd?: number;
  freight_usd?: number;
}

export interface StockInvoiceData {
  items: StockInvoiceItem[];
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
}

export class StockInvoiceService {
  private static readonly COMPANY_INFO = {
    name: "Car Management System",
    address: "123 Business Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@carmanagement.com",
    website: "www.carmanagement.com",
  };

  static generateStockInvoice(items: StockInvoiceItem[]): void {
    const invoiceData: StockInvoiceData = {
      items,
      company: this.COMPANY_INFO,
      invoice_number: `STK-INV-${Date.now().toString().slice(-6)}`,
      invoice_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      due_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      customer_name: "Stock Customer",
      customer_email: "customer@example.com",
      shipping_address: "123 Main St, City, State 12345",
    };

    this.createStockPDF(invoiceData);
  }

  private static createStockPDF(data: StockInvoiceData): void {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors for Stock Invoice
    const primaryColor = "#059669"; // Green
    const secondaryColor = "#64748b"; // Gray
    const accentColor = "#dc2626"; // Red
    const textColor = "#1e293b"; // Dark gray
    const lightGray = "#f0fdf4"; // Light green

    // Helper function to add text with styling
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      doc.setFontSize(options.fontSize || 12);
      doc.setTextColor(options.color || textColor);
      doc.setFont(options.font || "helvetica", options.style || "normal");
      doc.text(text, x, y);
    };

    // Helper function to add line
    const addLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string = primaryColor
    ) => {
      doc.setDrawColor(color);
      doc.setLineWidth(0.5);
      doc.line(x1, y1, x2, y2);
    };

    // Helper function to add rectangle
    const addRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string = lightGray
    ) => {
      doc.setFillColor(color);
      doc.rect(x, y, width, height, "F");
    };

    let yPosition = 20;

    // Header with green gradient background
    addRect(0, 0, pageWidth, 60, primaryColor);

    // Company logo area (Stock icon)
    addText("📦", 20, 25, { fontSize: 24, color: "#ffffff" });
    addText(data.company.name, 50, 25, {
      fontSize: 20,
      color: "#ffffff",
      style: "bold",
    });
    addText("Stock Management System", 50, 32, {
      fontSize: 12,
      color: "#e2e8f0",
    });

    // Company details
    addText(data.company.address, 20, 45, { fontSize: 10, color: "#e2e8f0" });
    addText(data.company.phone, 20, 50, { fontSize: 10, color: "#e2e8f0" });
    addText(data.company.email, 20, 55, { fontSize: 10, color: "#e2e8f0" });

    // Stock Invoice details
    addText("STOCK INVOICE", pageWidth - 70, 25, {
      fontSize: 24,
      color: "#ffffff",
      style: "bold",
    });
    addText(`#${data.invoice_number}`, pageWidth - 70, 32, {
      fontSize: 14,
      color: "#e2e8f0",
    });
    addText(`Date: ${data.invoice_date}`, pageWidth - 70, 40, {
      fontSize: 10,
      color: "#e2e8f0",
    });
    addText(`Due: ${data.due_date}`, pageWidth - 70, 45, {
      fontSize: 10,
      color: "#e2e8f0",
    });

    yPosition = 80;

    // Customer information
    addText("Customer Details:", 20, yPosition, {
      fontSize: 14,
      style: "bold",
    });
    yPosition += 10;

    addText(data.customer_name, 20, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    yPosition += 6;
    addText(data.customer_email, 20, yPosition, {
      fontSize: 10,
      color: secondaryColor,
    });
    yPosition += 6;

    addText("Shipping Address:", 20, yPosition, {
      fontSize: 10,
      style: "bold",
    });
    yPosition += 6;
    const addressLines = data.shipping_address.split("\n");
    addressLines.forEach((line) => {
      addText(line, 20, yPosition, { fontSize: 10, color: secondaryColor });
      yPosition += 5;
    });

    yPosition += 20;

    // Stock items table
    addText("Stock Items", 20, yPosition, { fontSize: 16, style: "bold" });
    yPosition += 15;

    // Table header
    addRect(20, yPosition - 5, pageWidth - 40, 15, lightGray);
    addText("Code", 25, yPosition + 2, { fontSize: 10, style: "bold" });
    addText("Item", 50, yPosition + 2, { fontSize: 10, style: "bold" });
    addText("Description", 100, yPosition + 2, { fontSize: 10, style: "bold" });
    addText("Qty", pageWidth - 80, yPosition + 2, {
      fontSize: 10,
      style: "bold",
    });
    addText("FOB", pageWidth - 60, yPosition + 2, {
      fontSize: 10,
      style: "bold",
    });
    addText("Freight", pageWidth - 40, yPosition + 2, {
      fontSize: 10,
      style: "bold",
    });
    addText("Total", pageWidth - 20, yPosition + 2, {
      fontSize: 10,
      style: "bold",
    });

    yPosition += 10;

    // Table rows
    data.items.forEach((item, index) => {
      const itemY = yPosition + index * 25;

      // Alternating row colors
      if (index % 2 === 0) {
        addRect(20, itemY - 5, pageWidth - 40, 25, "#fafafa");
      }

      // Item code
      addText(item.code || `STK-${item.car.id}`, 25, itemY + 5, {
        fontSize: 9,
        style: "bold",
      });

      // Item image placeholder
      addText("🚗", 50, itemY + 5, { fontSize: 12 });

      // Item details
      addText(`${item.car.make} ${item.car.model}`, 65, itemY, {
        fontSize: 10,
        style: "bold",
      });
      addText(`Year: ${item.car.year}`, 65, itemY + 5, {
        fontSize: 8,
        color: secondaryColor,
      });
      addText(
        `Mileage: ${item.car.mileage_km?.toLocaleString()} km`,
        65,
        itemY + 10,
        { fontSize: 8, color: secondaryColor }
      );

      // Quantity
      addText(item.quantity.toString(), pageWidth - 80, itemY + 5, {
        fontSize: 10,
        style: "bold",
      });

      // FOB Value
      addText(
        `$${(item.fob_value_usd || item.price).toLocaleString()}`,
        pageWidth - 60,
        itemY + 5,
        {
          fontSize: 9,
        }
      );

      // Freight
      addText(
        `$${(item.freight_usd || 0).toLocaleString()}`,
        pageWidth - 40,
        itemY + 5,
        {
          fontSize: 9,
        }
      );

      // Total
      const itemTotal = item.price * item.quantity;
      addText(`$${itemTotal.toLocaleString()}`, pageWidth - 20, itemY + 5, {
        fontSize: 10,
        style: "bold",
      });
    });

    yPosition += data.items.length * 25 + 20;

    // Totals section
    const totalsX = pageWidth - 100;
    const subtotal = data.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const totalFob = data.items.reduce(
      (total, item) =>
        total + (item.fob_value_usd || item.price) * item.quantity,
      0
    );
    const totalFreight = data.items.reduce(
      (total, item) => total + (item.freight_usd || 0) * item.quantity,
      0
    );
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    addText("Subtotal:", totalsX, yPosition, { fontSize: 12 });
    addText(`$${subtotal.toLocaleString()}`, totalsX + 50, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    yPosition += 8;

    addText("Total FOB:", totalsX, yPosition, { fontSize: 12 });
    addText(`$${totalFob.toLocaleString()}`, totalsX + 50, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    yPosition += 8;

    addText("Total Freight:", totalsX, yPosition, { fontSize: 12 });
    addText(`$${totalFreight.toLocaleString()}`, totalsX + 50, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    yPosition += 8;

    addText("Tax (8%):", totalsX, yPosition, { fontSize: 12 });
    addText(`$${tax.toLocaleString()}`, totalsX + 50, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    yPosition += 8;

    addLine(totalsX, yPosition, totalsX + 60, yPosition, textColor);
    yPosition += 8;

    addText("Total:", totalsX, yPosition, { fontSize: 14, style: "bold" });
    addText(`$${total.toLocaleString()}`, totalsX + 50, yPosition, {
      fontSize: 14,
      style: "bold",
      color: accentColor,
    });
    yPosition += 20;

    // Stock information
    addText("Stock Information:", 20, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    yPosition += 10;
    addText(`Total Items: ${data.items.length}`, 20, yPosition, {
      fontSize: 10,
    });
    addText(
      `Total Quantity: ${data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      )}`,
      20,
      yPosition + 6,
      { fontSize: 10 }
    );

    // Footer
    yPosition = pageHeight - 40;
    addLine(20, yPosition, pageWidth - 20, yPosition, secondaryColor);
    yPosition += 10;

    addText("Thank you for your stock purchase!", 20, yPosition, {
      fontSize: 12,
      style: "bold",
      color: primaryColor,
    });
    yPosition += 8;

    addText(
      `For questions about this stock invoice, contact us at ${data.company.email}`,
      20,
      yPosition,
      { fontSize: 10, color: secondaryColor }
    );
    addText(`Visit us at ${data.company.website}`, 20, yPosition + 6, {
      fontSize: 10,
      color: secondaryColor,
    });

    // Page number
    addText(`Page 1 of 1`, pageWidth - 30, pageHeight - 10, {
      fontSize: 8,
      color: secondaryColor,
    });

    // Download the PDF
    const filename = `Stock-Invoice-${data.invoice_number}.pdf`;
    doc.save(filename);
  }
}
