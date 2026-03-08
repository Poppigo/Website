import { useEffect } from "react";
import { Truck, Clock, MapPin, Phone, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingInfo = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-peach">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-muted-foreground mb-2">Last updated: March 2026</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Shipping Info
          </h1>
          <p className="text-muted-foreground text-sm mb-12 leading-relaxed">
            We want your PoppiGo order to reach you as quickly and safely as possible. Here's
            everything you need to know about how we ship.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-coral/15 flex items-center justify-center">
                <Clock size={20} className="text-coral" />
              </div>
              <h3 className="font-display font-bold text-foreground text-base">Delivery Time</h3>
              <p className="text-sm text-muted-foreground">
                2–5 working days, depending on your pin code.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Truck size={20} className="text-emerald-600" />
              </div>
              <h3 className="font-display font-bold text-foreground text-base">Pan India</h3>
              <p className="text-sm text-muted-foreground">
                We ship to all serviceable pin codes across India.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MapPin size={20} className="text-blue-500" />
              </div>
              <h3 className="font-display font-bold text-foreground text-base">Tracking</h3>
              <p className="text-sm text-muted-foreground">
                You'll receive a tracking update once your order is dispatched.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Processing Time
              </h2>
              <p>
                Orders are processed on the same day or the next working day after payment
                confirmation. Orders placed on weekends or public holidays will be processed on the
                next working day.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Delivery Timelines
              </h2>
              <p>
                Once dispatched, expected delivery is within <strong>2–5 working days</strong>{" "}
                depending on your pin code and the courier partner's coverage in your area.
              </p>
              <p className="mt-2">
                Metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, etc.) generally
                receive orders within 2–3 working days. Tier 2/3 cities and remote pin codes may
                take up to 5 working days.
              </p>
              <p className="mt-2">
                Delivery timelines are estimated and may be affected by unforeseen circumstances
                such as weather, public holidays, or logistics delays beyond our control.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Shipping Charges
              </h2>
              <p>
                Shipping charges, if applicable, will be displayed at checkout before you confirm
                your order. We periodically offer free shipping promotions — keep an eye out!
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Cash on Delivery (COD)
              </h2>
              <p>
                COD is available on eligible orders and pin codes. The exact amount is payable to
                the delivery partner at the time of delivery. Please keep the exact amount ready to
                ensure a smooth handover.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Address Accuracy
              </h2>
              <p>
                Please ensure your shipping address, pin code, and contact number are accurate at
                the time of placing the order. PoppiGo is not responsible for delays or failed
                deliveries due to incomplete or incorrect address information.
              </p>
              <p className="mt-2">
                If you need to update your address, contact us immediately at{" "}
                <a href="mailto:hello@poppigo.co" className="text-coral hover:underline">
                  hello@poppigo.co
                </a>{" "}
                — we'll do our best to update it before dispatch.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Undelivered Orders
              </h2>
              <p>
                If a delivery attempt fails (e.g. no one available to receive the package), the
                courier will attempt re-delivery or hold the package at the nearest delivery hub.
                Please check your tracking link for further instructions.
              </p>
              <p className="mt-2">
                If an order is returned to us due to failed delivery, we will reach out to arrange
                re-delivery. Additional shipping charges may apply.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-4">
              Need help with your shipment?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <a
                href="mailto:hello@poppigo.co"
                className="flex items-center gap-2 text-muted-foreground hover:text-coral transition-colors"
              >
                <Mail size={16} />
                hello@poppigo.co
              </a>
              <a
                href="tel:+919004491875"
                className="flex items-center gap-2 text-muted-foreground hover:text-coral transition-colors"
              >
                <Phone size={16} />
                +91 9004491875
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingInfo;
