"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    resend;
    logger = new common_1.Logger(MailService_1.name);
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_placeholder');
    }
    async sendOrderConfirmation(order) {
        const { customer, orderNumber, totalAmount, items } = order;
        const itemsHtml = items.map((item) => `
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
        }
        catch (err) {
            this.logger.error(`Failed to send confirmation email: ${err.message}`);
        }
    }
    async sendDigitalDelivery(order, digitalItems) {
        const { customer, orderNumber } = order;
        const linksHtml = digitalItems.map((item) => `
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
        }
        catch (err) {
            this.logger.error(`Failed to send digital delivery email: ${err.message}`);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map