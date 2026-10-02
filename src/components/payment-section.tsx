import QRCode from "qrcode";
import { DonationMethods } from "@/components/donation-methods";
import { organization } from "@/lib/organization";

export async function PaymentSection() {
  const qrDataUrl = await QRCode.toDataURL(organization.paymentUrl, {
    errorCorrectionLevel: "M",
    margin: 4,
    width: 336,
    color: { dark: "#173d30", light: "#ffffff" },
  });

  return <section id="payment-and-contact" className="home-section payment-section"><div className="container-page"><DonationMethods qrDataUrl={qrDataUrl} /></div></section>;
}