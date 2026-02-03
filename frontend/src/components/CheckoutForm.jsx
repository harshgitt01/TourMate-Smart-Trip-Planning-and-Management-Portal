import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";

const CheckoutForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin, 
            },
            redirect: "if_required",
        });

        if (error) {
            toast.error(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess(); 
        } else {
            toast.error("Payment failed.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '20px'}}>
                <PaymentElement />
            </div>
            <button 
                type="submit" 
                disabled={isProcessing || !stripe} 
                className="btn-primary" 
                style={{ width: '100%' }}
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};

export default CheckoutForm;