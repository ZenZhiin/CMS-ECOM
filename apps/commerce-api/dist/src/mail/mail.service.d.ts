export declare class MailService {
    private resend;
    private readonly logger;
    constructor();
    sendOrderConfirmation(order: any): Promise<void>;
    sendDigitalDelivery(order: any, digitalItems: any[]): Promise<void>;
}
