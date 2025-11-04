import { useEffect, useRef } from "react";
import { donation } from "../../paths";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PaypalButton({ campaignId, amount }) {
    const paypalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // If PayPal SDK already loaded, render immediately
        if (window.paypal) {
            renderButton();
            return;
        }

        // Otherwise, dynamically inject the PayPal SDK
        const script = document.createElement("script");
        const clientId = import.meta.env.VITE_PAYPAL_CLIENTID;
        if (!clientId) {
            toast.error("Something went wrong...");
            return;
        }
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        script.async = true;
        script.onload = renderButton;
        document.body.appendChild(script);

        function renderButton() {
            if (!window.paypal || !paypalRef.current) return;

            window.paypal.Buttons({
                createOrder: async () => {
                    const res = await fetch(donation.createOrder, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ campaignId, amount }),
                    });
                    const data = await res.json();
                    return data.orderId;
                },
                onApprove: async (data) => {
                    const res = await fetch(donation.captureOrder, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderId: data.orderID }),
                    });
                    const result = await res.json();
                    if (result.paid) {
                        toast.info("Payment successful!");
                        navigate("/");
                    } else {
                        toast.error("Payment unsuccessful!");
                        navigate("/");
                    }
                },
                onError: (err) => {
                    console.error("PayPal error:", err);
                    toast.error("Something went wrong with PayPal.");
                },
            }).render(paypalRef.current);
        }
    }, [campaignId, amount]);

    return <div ref={paypalRef}></div>;
}