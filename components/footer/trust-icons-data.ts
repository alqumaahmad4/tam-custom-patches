export type FooterTrustIconCategory = "payment" | "processor" | "security" | "shipping";

export type FooterTrustIcon = {
  id: string;
  name: string;
  category: FooterTrustIconCategory;
  assetPath: string;
  accessibleLabel: string;
  intrinsicWidth: number;
  intrinsicHeight: number;
  status: "placeholder" | "approved";
};

export const footerTrustIcons = [
  {
    id: "visa",
    name: "Visa",
    category: "payment",
    assetPath: "/trust-icons/visa.svg",
    accessibleLabel: "Visa",
    intrinsicWidth: 88,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    category: "payment",
    assetPath: "/trust-icons/mastercard.svg",
    accessibleLabel: "Mastercard",
    intrinsicWidth: 104,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "american-express",
    name: "American Express",
    category: "payment",
    assetPath: "/trust-icons/american-express.svg",
    accessibleLabel: "American Express",
    intrinsicWidth: 116,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "paypal",
    name: "PayPal",
    category: "payment",
    assetPath: "/trust-icons/paypal.svg",
    accessibleLabel: "PayPal",
    intrinsicWidth: 96,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "processor",
    assetPath: "/trust-icons/stripe.svg",
    accessibleLabel: "Stripe",
    intrinsicWidth: 88,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "ssl",
    name: "SSL secured connection",
    category: "security",
    assetPath: "/trust-icons/ssl.svg",
    accessibleLabel: "SSL secured connection",
    intrinsicWidth: 72,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "dhl",
    name: "DHL",
    category: "shipping",
    assetPath: "/trust-icons/dhl.svg",
    accessibleLabel: "DHL",
    intrinsicWidth: 88,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "fedex",
    name: "FedEx",
    category: "shipping",
    assetPath: "/trust-icons/fedex.svg",
    accessibleLabel: "FedEx",
    intrinsicWidth: 100,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "ups",
    name: "UPS",
    category: "shipping",
    assetPath: "/trust-icons/ups.svg",
    accessibleLabel: "UPS",
    intrinsicWidth: 72,
    intrinsicHeight: 32,
    status: "placeholder",
  },
  {
    id: "usps",
    name: "USPS",
    category: "shipping",
    assetPath: "/trust-icons/usps.svg",
    accessibleLabel: "USPS",
    intrinsicWidth: 88,
    intrinsicHeight: 32,
    status: "placeholder",
  },
] as const satisfies readonly FooterTrustIcon[];
