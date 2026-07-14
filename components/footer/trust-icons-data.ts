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
    intrinsicWidth: 9999,
    intrinsicHeight: 3240,
    status: "approved",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    category: "payment",
    assetPath: "/trust-icons/mastercard.svg",
    accessibleLabel: "Mastercard",
    intrinsicWidth: 9999,
    intrinsicHeight: 6196,
    status: "approved",
  },
  {
    id: "american-express",
    name: "American Express",
    category: "payment",
    assetPath: "/trust-icons/american-express.svg",
    accessibleLabel: "American Express",
    intrinsicWidth: 5000,
    intrinsicHeight: 5000,
    status: "approved",
  },
  {
    id: "paypal",
    name: "PayPal",
    category: "payment",
    assetPath: "/trust-icons/paypal.svg",
    accessibleLabel: "PayPal",
    intrinsicWidth: 7363,
    intrinsicHeight: 5000,
    status: "approved",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "processor",
    assetPath: "/trust-icons/stripe.svg",
    accessibleLabel: "Stripe",
    intrinsicWidth: 9999,
    intrinsicHeight: 4161,
    status: "approved",
  },
  {
    id: "ssl",
    name: "SSL secured connection",
    category: "security",
    assetPath: "/trust-icons/ssl.svg",
    accessibleLabel: "SSL secured connection",
    intrinsicWidth: 5036,
    intrinsicHeight: 5001,
    status: "approved",
  },
  {
    id: "dhl",
    name: "DHL",
    category: "shipping",
    assetPath: "/trust-icons/dhl.svg",
    accessibleLabel: "DHL",
    intrinsicWidth: 10000,
    intrinsicHeight: 1415,
    status: "approved",
  },
  {
    id: "fedex",
    name: "FedEx",
    category: "shipping",
    assetPath: "/trust-icons/fedex.svg",
    accessibleLabel: "FedEx",
    intrinsicWidth: 9999,
    intrinsicHeight: 3063,
    status: "approved",
  },
  {
    id: "ups",
    name: "UPS",
    category: "shipping",
    assetPath: "/trust-icons/ups.svg",
    accessibleLabel: "UPS",
    intrinsicWidth: 4191,
    intrinsicHeight: 5000,
    status: "approved",
  },
  {
    id: "usps",
    name: "USPS",
    category: "shipping",
    assetPath: "/trust-icons/usps.svg",
    accessibleLabel: "USPS",
    intrinsicWidth: 9999,
    intrinsicHeight: 1669,
    status: "approved",
  },
] as const satisfies readonly FooterTrustIcon[];
