import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
  }

  async sendOrderConfirmation(order: any) {
    const { customer, orderNumber, totalAmount, items } = order;
    
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.variant.product.name} (${item.variant.sku}) x ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #000;">Order Confirmed!</h1>
        <p>Hi ${customer.firstName || 'there'},</p>
        <p>Thank you for your purchase! Your order <strong>#${orderNumber}</strong> has been received and is being processed.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f9f9f9;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Total</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">$${parseFloat(totalAmount).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <p>We'll notify you as soon as your items are on their way!</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999;">Zhiin CMS E-commerce. All rights reserved.</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: 'Zhiin Store <orders@zhiin.com>',
        to: customer.email,
        subject: `Order Confirmation #${orderNumber}`,
        html,
      });
      this.logger.log(`Confirmation email sent for order ${orderNumber}`);
    } catch (err) {
      this.logger.error(`Failed to send confirmation email: ${err.message}`);
    }
  }

  async sendDigitalDelivery(order: any, digitalItems: any[]) {
    const { customer, orderNumber } = order;

    const linksHtml = digitalItems.map((item: any) => `
      <div style="background: #f4f4f4; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 10px 0;">${item.productName}</h3>
        <a href="${item.fileUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Download Now
        </a>
        <p style="font-size: 11px; color: #666; margin-top: 10px;">Link expires in ${item.expiry || 24} hours.</p>
      </div>
    `).join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #000;">Your Digital Downloads</h1>
        <p>Hi ${customer.firstName || 'there'},</p>
        <p>Your digital products from order <strong>#${orderNumber}</strong> are ready for download!</p>
        
        <div style="margin: 30px 0;">
          ${linksHtml}
        </div>

        <p>If you have any issues with your downloads, please reply to this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999;">Zhiin CMS E-commerce. All rights reserved.</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: 'Zhiin Store <downloads@zhiin.com>',
        to: customer.email,
        subject: `Your Digital Downloads - Order #${orderNumber}`,
        html,
      });
      this.logger.log(`Digital delivery email sent for order ${orderNumber}`);
    } catch (err) {
      this.logger.error(`Failed to send digital delivery email: ${err.message}`);
    }
  }
}
