import PDFDocument from 'pdfkit';

/**
 * Generates a luxury Sri Vijaylaxmi Sarees GST Tax Invoice PDF as a Buffer.
 * @param {Object} order - Full order object from MongoDB
 * @returns {Promise<Buffer>}
 */
export const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Palette Colors
      const primaryColor = '#700B1A'; // Royal Burgundy
      const goldColor = '#D97706'; // Heritage Gold
      const darkColor = '#1C1917'; // Charcoal
      const grayLight = '#F5F5F4'; // Off-white table header
      const borderGray = '#E7E5E4';

      // 1. Header Banner & Branding
      doc.rect(40, 40, 515, 75).fill(primaryColor);

      doc.fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .fontSize(20)
        .text('SRI VIJAYLAXMI SAREES', 55, 52, { characterSpacing: 1.5 });

      doc.fontSize(8.5)
        .font('Helvetica')
        .fillColor('#FDE68A')
        .text('Pure Handloom & Heritage Silk Weaves | Silk Mark Certified', 55, 75);

      doc.fillColor('#FFFFFF')
        .fontSize(7.5)
        .text('GSTIN: 36AAACS1234F1Z8 | Fulfill Hub: Telangana / Hyderabad, India', 55, 90)
        .text('Phone: +91 82183 22073 | Email: care@srivijaylaxmisarees.com', 55, 100);

      doc.fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('TAX INVOICE', 410, 56, { align: 'right', width: 130 });

      doc.fontSize(8.5)
        .font('Helvetica')
        .text(`Inv #: INV-${order.orderNumber?.replace('SVL-', '') || Date.now()}`, 410, 75, { align: 'right', width: 130 })
        .text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 410, 88, { align: 'right', width: 130 });

      // 2. Invoice & Customer Information
      let y = 130;

      // Bill To Box
      doc.rect(40, y, 250, 95).strokeColor(borderGray).stroke();
      doc.rect(40, y, 250, 20).fill('#FAF8F5');
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(8.5).text('BILLED & SHIPPED TO', 50, y + 6);

      const addr = order.shippingAddress || {};
      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(9).text(addr.fullName || 'Customer', 50, y + 26);
      doc.font('Helvetica').fontSize(8).fillColor('#44403C')
        .text(`${addr.street || ''} ${addr.landmark ? ', ' + addr.landmark : ''}`, 50, y + 38, { width: 230 })
        .text(`${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`, 50, y + 54)
        .text(`Phone: ${addr.phone || 'N/A'}`, 50, y + 68)
        .text(`Email: ${order.user?.email || addr.email || 'N/A'}`, 50, y + 80);

      // Order Summary Details Box
      doc.rect(305, y, 250, 95).strokeColor(borderGray).stroke();
      doc.rect(305, y, 250, 20).fill('#FAF8F5');
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(8.5).text('ORDER & PAYMENT DETAILS', 315, y + 6);

      doc.fillColor(darkColor).font('Helvetica').fontSize(8)
        .text('Order ID:', 315, y + 26)
        .font('Helvetica-Bold').text(order.orderNumber || 'SVL-ORDER', 400, y + 26)
        .font('Helvetica').text('Payment Method:', 315, y + 40)
        .font('Helvetica-Bold').text(`${order.paymentMethod || 'COD'} (${order.isPaid ? 'PAID' : 'PENDING'})`, 400, y + 40)
        .font('Helvetica').text('Order Status:', 315, y + 54)
        .font('Helvetica-Bold').fillColor(primaryColor).text(order.orderStatus || 'Placed', 400, y + 54)
        .fillColor(darkColor).font('Helvetica').text('Dispatched From:', 315, y + 68)
        .text('Hyderabad Handloom Hub', 400, y + 68)
        .text('Authenticity:', 315, y + 80)
        .fillColor(goldColor).font('Helvetica-Bold').text('100% Pure Silk Certified', 400, y + 80);

      // 3. Products Table
      y = 240;

      // Table Header
      doc.rect(40, y, 515, 22).fill(grayLight);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(8.5);
      doc.text('#', 50, y + 6);
      doc.text('Item Description (Handloom Silk Sarees)', 75, y + 6);
      doc.text('Color', 300, y + 6);
      doc.text('Qty', 370, y + 6, { width: 30, align: 'center' });
      doc.text('Price (INR)', 410, y + 6, { width: 60, align: 'right' });
      doc.text('Total (INR)', 480, y + 6, { width: 65, align: 'right' });

      y += 24;

      const items = order.orderItems || [];
      items.forEach((item, index) => {
        const itemPrice = Number(item.price || 0);
        const qty = Number(item.quantity || 1);
        const lineTotal = itemPrice * qty;

        if (index % 2 === 1) {
          doc.rect(40, y - 2, 515, 22).fill('#FAF8F5');
        }

        doc.fillColor(darkColor).font('Helvetica').fontSize(8);
        doc.text(`${index + 1}`, 50, y + 4);
        doc.font('Helvetica-Bold').text(item.title || 'Pure Silk Saree', 75, y + 4, { width: 215, lineBreak: false });
        doc.font('Helvetica').fillColor('#57534E').text(item.color || 'Standard', 300, y + 4);
        doc.text(`${qty}`, 370, y + 4, { width: 30, align: 'center' });
        doc.text(`Rs. ${itemPrice.toLocaleString('en-IN')}`, 410, y + 4, { width: 60, align: 'right' });
        doc.font('Helvetica-Bold').fillColor(primaryColor).text(`Rs. ${lineTotal.toLocaleString('en-IN')}`, 480, y + 4, { width: 65, align: 'right' });

        y += 22;
      });

      doc.rect(40, y + 2, 515, 1).fill(borderGray);
      y += 12;

      // 4. Financial Calculations & Summary Box
      const summaryX = 340;
      doc.rect(summaryX, y, 215, 85).fill('#FAF8F5').strokeColor(borderGray).stroke();

      const itemsPrice = Number(order.itemsPrice || order.totalPrice || 0);
      const discount = Number(order.discountAmount || 0);
      const shipping = Number(order.shippingPrice || 0);
      const grandTotal = Number(order.totalPrice || itemsPrice);

      doc.fillColor(darkColor).font('Helvetica').fontSize(8.5);
      doc.text('Subtotal:', summaryX + 12, y + 10);
      doc.text(`Rs. ${itemsPrice.toLocaleString('en-IN')}`, summaryX + 110, y + 10, { width: 90, align: 'right' });

      if (discount > 0) {
        doc.fillColor('#15803D').text(`Discount (${order.couponCode || 'PROMO'}):`, summaryX + 12, y + 24);
        doc.text(`- Rs. ${discount.toLocaleString('en-IN')}`, summaryX + 110, y + 24, { width: 90, align: 'right' });
      } else {
        doc.fillColor(darkColor).text('Discount:', summaryX + 12, y + 24);
        doc.text('Rs. 0', summaryX + 110, y + 24, { width: 90, align: 'right' });
      }

      doc.fillColor(darkColor).text('Shipping & Silk Insurance:', summaryX + 12, y + 38);
      doc.text(shipping > 0 ? `Rs. ${shipping.toLocaleString('en-IN')}` : 'FREE', summaryX + 110, y + 38, { width: 90, align: 'right' });

      doc.rect(summaryX, y + 54, 215, 31).fill(primaryColor);
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10);
      doc.text('Grand Total:', summaryX + 12, y + 64);
      doc.text(`Rs. ${grandTotal.toLocaleString('en-IN')}`, summaryX + 100, y + 64, { width: 100, align: 'right' });

      // Left Box: Authenticity & Care note
      doc.rect(40, y, 285, 85).strokeColor(borderGray).stroke();
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(8.5).text('AUTHENTICITY & SILK CARE PROMISE', 50, y + 8);
      doc.fillColor('#44403C').font('Helvetica').fontSize(7.5)
        .text('• 100% Genuine Handwoven Pure Silk with Silk Mark verification.', 50, y + 24)
        .text('• Dry Clean only. Store in breathable cotton muslin fabric bag.', 50, y + 36)
        .text('• Easy 7-day return policy for unused sarees with original tags.', 50, y + 48)
        .text('• Support: WhatsApp +91 82183 22073 | care@srivijaylaxmisarees.com', 50, y + 60);

      // 5. Footer Signature
      const footerY = 510;
      doc.rect(40, footerY, 515, 35).fill('#FAF8F5').strokeColor(borderGray).stroke();
      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(8)
        .text('Thank you for patronizing Indian Handloom Weavers!', 50, footerY + 8, { align: 'center', width: 495 });
      doc.font('Helvetica').fontSize(7).fillColor('#78716C')
        .text('This is a computer-generated tax invoice. Registered with Ministry of Textiles Handloom Board.', 50, footerY + 20, { align: 'center', width: 495 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
