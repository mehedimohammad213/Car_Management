import jsPDF from "jspdf";
import { PaymentHistory } from "./paymentHistoryApi";

export interface PaymentHistoryInvoiceData {
  paymentHistory: PaymentHistory;
  company: {
    name: string;
    address: string;
    email: string;
  };
  referenceNumber: string;
}

export class PaymentHistoryInvoiceService {
  private static readonly COMPANY_INFO = {
    name: "Dream Agent Car Vision",
    address: "57, PURANA PALTAN LINE, VIP ROAD, SEL-TRIDENT TOWER, DHAKA-1000",
    email: "carvision@gmail.com",
  };

  static generateSalesTrackingReport(paymentHistory: PaymentHistory): void {
    const referenceNumber = this.generateReferenceNumber(paymentHistory.id);
    
    const invoiceData: PaymentHistoryInvoiceData = {
      paymentHistory,
      company: this.COMPANY_INFO,
      referenceNumber,
    };

    this.createPDF(invoiceData);
  }

  private static generateReferenceNumber(id: number): string {
    // Generate reference number like: F24TCR.SX2V-01
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const paddedId = String(id).padStart(2, "0");
    return `F${year}TCR.${random}-${paddedId}`;
  }

  private static createPDF(data: PaymentHistoryInvoiceData): void {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;

    // Colors
    const textColor = "#000000";
    const lightGray = "#f5f5f5";
    const orangeColor = "#FFA500";

    // Helper function to add text
    const addText = (
      text: string,
      x: number,
      y: number,
      options: any = {}
    ) => {
      doc.setFontSize(options.fontSize || 12);
      doc.setTextColor(options.color || textColor);
      doc.setFont(options.font || "helvetica", options.style || "normal");
      
      // Handle text wrapping
      const maxWidth = options.maxWidth || pageWidth - x - margin;
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length;
    };

    // Helper function to add rectangle
    const addRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string,
      fill: boolean = true
    ) => {
      doc.setFillColor(color);
      doc.rect(x, y, width, height, fill ? "F" : "S");
    };

    // Helper function to add table cell
    const addTableCell = (
      text: string,
      x: number,
      y: number,
      width: number,
      height: number,
      options: any = {}
    ) => {
      // Draw border
      doc.setDrawColor("#000000");
      doc.setLineWidth(0.1);
      doc.rect(x, y, width, height, "S");

      // Add text
      const padding = 2;
      const textX = x + padding;
      const textY = y + height / 2 + 2;
      doc.setFontSize(options.fontSize || 10);
      doc.setTextColor(options.color || textColor);
      doc.setFont(options.font || "helvetica", options.style || "normal");
      
      const maxTextWidth = width - 2 * padding;
      const lines = doc.splitTextToSize(text || "", maxTextWidth);
      doc.text(lines, textX, textY, {
        align: options.align || "left",
        maxWidth: maxTextWidth,
      });
    };

    let yPosition = margin;

    // Header Section
    // Company name (left)
    addText(data.company.name, margin, yPosition, {
      fontSize: 18,
      style: "bold",
    });
    yPosition += 7;

    // Company address
    addText(data.company.address, margin, yPosition, {
      fontSize: 10,
    });
    yPosition += 5;

    // Email
    addText(`Email: ${data.company.email}`, margin, yPosition, {
      fontSize: 10,
    });
    yPosition += 8;

    // Reference Number Box (right aligned)
    const refBoxWidth = 50;
    const refBoxHeight = 10;
    const refBoxX = pageWidth - margin - refBoxWidth;
    const refBoxY = margin;
    addRect(refBoxX, refBoxY, refBoxWidth, refBoxHeight, orangeColor);
    addText(`Ref: #${data.referenceNumber}`, refBoxX + 2, refBoxY + 7, {
      fontSize: 11,
      style: "bold",
      color: "#000000",
    });

    // Title
    addText("Sales Tracking Report", margin, yPosition, {
      fontSize: 16,
      style: "bold",
      maxWidth: pageWidth - 2 * margin,
    });
    yPosition += 10;

    // Car Basic Information Section
    addText("Car Basic Information", margin, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
    yPosition += 7;

    // Lot No. and Stock No. (if car exists)
    const car = data.paymentHistory.car;
    if (car) {
      const lotNo = car.ref_no || "N/A";
      addText(`Lot No. ${lotNo}`, margin, yPosition, { fontSize: 10 });
      yPosition += 6;
    }

    // Car details table
    const tableStartY = yPosition;
    const rowHeight = 8;
    const col1Width = 40;
    const col2Width = 70;
    const col3Width = 70;

    // Table headers
    const headers = [
      ["Make / Model / Year", "Package", "Fuel Type"],
      ["Color", "Transmission", "Seats"],
      ["Chassis / VIN", "Engine No.", "Engine Capacity"],
      ["Drive", "Number of Keys", "Mileage"],
    ];

    const values = car
      ? [
          [
            `${car.year || ""} ${car.make || ""} ${car.model || ""}`,
            car.package || "-",
            car.fuel || "N/A",
          ],
          [
            car.color || "N/A",
            car.transmission || "N/A",
            car.seats?.toString() || "N/A",
          ],
          [
            car.chassis_no_full || car.chassis_no_masked || "N/A",
            "N/A", // Engine number not in car model
            car.engine_cc ? `${car.engine_cc} cc` : "N/A",
          ],
          [
            car.drive || "N/A",
            "N/A", // Number of keys not directly available
            car.mileage_km ? `${car.mileage_km.toLocaleString()} Km` : "N/A",
          ],
        ]
      : [
          ["N/A", "N/A", "N/A"],
          ["N/A", "N/A", "N/A"],
          ["N/A", "N/A", "N/A"],
          ["N/A", "N/A", "N/A"],
        ];

    headers.forEach((row, rowIndex) => {
      const currentY = tableStartY + rowIndex * rowHeight;
      row.forEach((header, colIndex) => {
        const x = margin + colIndex * col1Width;
        addTableCell(
          header,
          x,
          currentY,
          col1Width,
          rowHeight,
          { fontSize: 9, style: "bold" }
        );
        addTableCell(
          values[rowIndex][colIndex],
          x,
          currentY + rowHeight,
          col1Width,
          rowHeight,
          { fontSize: 9 }
        );
      });
    });

    yPosition = tableStartY + headers.length * rowHeight * 2 + 5;

    // Wholesaler Information Section
    addText("WholeSaler Information", margin, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
    yPosition += 7;

    const wholesalerInfo = [
      { label: "Buyer:", value: data.paymentHistory.showroom_name || "N/A" },
      {
        label: "Address:",
        value: data.paymentHistory.wholesaler_address || "N/A",
      },
      {
        label: "Sale Date:",
        value: data.paymentHistory.purchase_date
          ? this.formatDate(data.paymentHistory.purchase_date)
          : "N/A",
      },
      {
        label: "Method:",
        value:
          data.paymentHistory.installments && data.paymentHistory.installments.length > 0
            ? "INSTALLMENTS"
            : "N/A",
      },
      {
        label: "Sale Price:",
        value: data.paymentHistory.purchase_amount
          ? `${this.formatCurrency(data.paymentHistory.purchase_amount)} BDT`
          : "N/A",
      },
      { label: "Remarks:", value: "" },
    ];

    wholesalerInfo.forEach((info, index) => {
      if (index % 2 === 0) {
        // Left column
        addText(info.label, margin, yPosition, { fontSize: 10 });
        addText(info.value, margin + 25, yPosition, { fontSize: 10 });
      } else {
        // Right column
        addText(info.label, margin + 100, yPosition, { fontSize: 10 });
        addText(info.value, margin + 125, yPosition, { fontSize: 10 });
        yPosition += 5;
      }
    });

    if (wholesalerInfo.length % 2 === 1) {
      yPosition += 5;
    }

    yPosition += 5;

    // Customer Information Section
    addText("Customer Information", margin, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
    yPosition += 7;

    const customerInfo = [
      {
        label: "Customer Name:",
        value: "N/A", // Not in payment history, can be added
      },
      {
        label: "NID Number:",
        value: data.paymentHistory.nid_number || "N/A",
      },
      { label: "TIN:", value: data.paymentHistory.tin_certificate || "N/A" },
      {
        label: "Contact No.:",
        value: data.paymentHistory.contact_number || "N/A",
      },
      { label: "Email:", value: data.paymentHistory.email || "N/A" },
      {
        label: "Address:",
        value: data.paymentHistory.customer_address || "N/A",
      },
    ];

    customerInfo.forEach((info, index) => {
      if (index % 2 === 0) {
        // Left column
        addText(info.label, margin, yPosition, { fontSize: 10 });
        addText(info.value, margin + 35, yPosition, { fontSize: 10 });
      } else {
        // Right column
        addText(info.label, margin + 100, yPosition, { fontSize: 10 });
        addText(info.value, margin + 135, yPosition, { fontSize: 10 });
        yPosition += 5;
      }
    });

    if (customerInfo.length % 2 === 1) {
      yPosition += 5;
    }

    yPosition += 5;

    // Payment Records Section
    addText("Payment Records", margin, yPosition, {
      fontSize: 12,
      style: "bold",
    });
    doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
    yPosition += 7;

    // Payment Records Table
    const paymentTableStartY = yPosition;
    const paymentColWidths = [20, 25, 20, 15, 20, 25, 20, 20];
    const paymentRowHeight = 8;
    const totalTableWidth = paymentColWidths.reduce((a, b) => a + b, 0);

    // Table headers
    const paymentHeaders = [
      "Date",
      "Description",
      "Amount",
      "Method",
      "Bank Name",
      "Cheque Number",
      "Balance",
      "Remarks",
    ];

    paymentHeaders.forEach((header, colIndex) => {
      const x =
        margin +
        paymentColWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
      addTableCell(
        header,
        x,
        paymentTableStartY,
        paymentColWidths[colIndex],
        paymentRowHeight,
        { fontSize: 9, style: "bold" }
      );
    });

    yPosition = paymentTableStartY + paymentRowHeight;

    // Payment records data
    const installments = data.paymentHistory.installments || [];
    if (installments.length === 0) {
      // Empty row
      paymentHeaders.forEach((_, colIndex) => {
        const x =
          margin +
          paymentColWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        addTableCell("", x, yPosition, paymentColWidths[colIndex], paymentRowHeight, {
          fontSize: 9,
        });
      });
      yPosition += paymentRowHeight;
    } else {
      installments.forEach((installment) => {
        // Check if we need a new page
        if (yPosition + paymentRowHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        const rowData = [
          installment.installment_date
            ? this.formatDateShort(installment.installment_date)
            : "",
          installment.description || "",
          installment.amount
            ? `${this.formatCurrency(installment.amount)}`
            : "",
          installment.payment_method || "",
          installment.bank_name || "",
          installment.cheque_number || "",
          installment.balance
            ? `${this.formatCurrency(installment.balance)}`
            : "",
          installment.remarks || "",
        ];

        rowData.forEach((cell, colIndex) => {
          const x =
            margin +
            paymentColWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
          addTableCell(
            cell,
            x,
            yPosition,
            paymentColWidths[colIndex],
            paymentRowHeight,
            { fontSize: 8 }
          );
        });

        yPosition += paymentRowHeight;
      });
    }

    // Save PDF
    const filename = `Sales_Tracking_Report_${data.referenceNumber}.pdf`;
    doc.save(filename);
  }

  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = date.getFullYear();
    return `${day}${this.getOrdinalSuffix(day)} ${month}, ${year}`;
  }

  private static formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  private static getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return "TH";
    switch (day % 10) {
      case 1:
        return "ST";
      case 2:
        return "ND";
      case 3:
        return "RD";
      default:
        return "TH";
    }
  }

  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

