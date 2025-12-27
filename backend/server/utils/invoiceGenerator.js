import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (order, stream) => {
    const doc = new PDFDocument({ margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, order);
    generateInvoiceTable(doc, order);
    generateFooter(doc);

    doc.pipe(stream);
    doc.end();
};

function generateHeader(doc) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("ShopHub Inc.", 110, 57)
        .fontSize(10)
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("Dhaka, Bangladesh, 1200", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, order) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Order ID:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(order._id, 150, customerInformationTop)
        .font("Helvetica")
        .text("Order Date:", 50, customerInformationTop + 15)
        .text(new Date(order.createdAt).toLocaleDateString(), 150, customerInformationTop + 15)
        .text("Total Amount:", 50, customerInformationTop + 30)
        .text(
            `BDT ${order.totalAmount}`,
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(order.shippingAddress.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(order.shippingAddress.address, 300, customerInformationTop + 15)
        .text(
            order.shippingAddress.city +
            ", " +
            order.shippingAddress.postalCode,
            300,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, order) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.name,
            "",
            `BDT ${item.price}`,
            item.quantity,
            `BDT ${item.price * item.quantity}`
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        `BDT ${order.subtotal}`
    );

    const shippingPosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        shippingPosition,
        "",
        "",
        "Shipping Cost",
        "",
        `BDT ${order.shippingCost}`
    );

    const discountPosition = shippingPosition + 20;
    generateTableRow(
        doc,
        discountPosition,
        "",
        "",
        "Discount",
        "",
        `- BDT ${order.discountAmount}`
    );

    const totalPosition = discountPosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        totalPosition,
        "",
        "",
        "Total",
        "",
        `BDT ${order.totalAmount}`
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Thank you for shopping with ShopHub. Visit again!",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}
