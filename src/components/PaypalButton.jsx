import { useEffect, useRef } from "react";
import { donation } from "../../paths";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getUser from "../helpers/getUser";

export default function PaypalButton({ campaignId, amount, rewardId }) {
    const paypalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isRendered = false;

        async function loadPayPalScript() {
            if (window.paypal) {
                renderButton();
                return;
            }

            const clientId = import.meta.env.VITE_PAYPAL_CLIENTID;
            if (!clientId) {
                toast.error("Missing PayPal Client ID");
                return;
            }

            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
            script.async = true;
            script.onload = renderButton;
            document.body.appendChild(script);
        }

        function renderButton() {
            if (isRendered || !paypalRef.current) return;
            isRendered = true;

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
                    const user = await getUser();
                    const res = await fetch(donation.captureOrder, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            orderId: data.orderID,
                            userId: user.userId,
                            campaignId,
                            amount,
                            paymentGatewayOrderId: data.orderID,
                            paymentMethod: "paypal",
                            rewardId,
                        }),
                    });

                    const result = await res.json();
                    if (res.ok) {
                        toast.success("Payment successful!");
                        navigate("/");
                    } else {
                        toast.error(result.error || "Payment failed.");
                    }
                },
                onError: (err) => {
                    console.error("PayPal error:", err);
                    toast.error("Something went wrong with PayPal.");
                },
            }).render(paypalRef.current);
        }

        loadPayPalScript();

        return () => {
            if (paypalRef.current) paypalRef.current.innerHTML = "";
        };
    }, [amount]);

    return <div ref={paypalRef}></div>;
}