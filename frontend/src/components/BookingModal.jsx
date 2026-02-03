import { useState } from 'react';
import { bookingApi } from '../api/axiosConfig';
import { getUserId } from '../utils/authUtils';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './CheckoutForm';

// Load key from .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingModal = ({ tourPackage, onClose }) => {
    const [step, setStep] = useState(1);
    const [clientSecret, setClientSecret] = useState("");
    const navigate = useNavigate();

    const handleInitializePayment = async () => {
        const userId = getUserId();
        if (!userId) {
            toast.error("Please login to book.");
            navigate('/login');
            return;
        }

        const loader = toast.loading("Initializing secure payment...");
        try {
            const response = await bookingApi.post('/payments/create-intent', {
                amount: tourPackage.price
            });
            
            setClientSecret(response.data.clientSecret);
            toast.dismiss(loader);
            setStep(2); 
        } catch (error) {
            toast.dismiss(loader);
            toast.error("Could not start payment.");
            console.error(error);
        }
    };

    const handleBookingSuccess = async () => {
        const userId = getUserId();
        
        try {
            setStep(3); 
            
            await bookingApi.post('/bookings', {
                userId: userId,
                packageId: tourPackage.id,
                status: 'CONFIRMED'
            });
            
            toast.success("Payment Successful!");
            
            setTimeout(() => {
                onClose();
                navigate('/my-bookings');
            }, 2500);

        } catch (error) {
            toast.error("Booking save failed. Contact support.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="card modal-card">
                {step === 1 && (
                    <>
                        <h2>Confirm Booking</h2>
                        <div className="summary" style={{margin: '20px 0', padding: '15px', background: '#f8fafc', borderRadius: '8px'}}>
                            <p><strong>Package:</strong> {tourPackage.packageName}</p>
                            <div style={{marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: '#2563eb'}}>
                                Total: ₹{tourPackage.price}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={onClose}>Cancel</button>
                            <button className="btn-primary" onClick={handleInitializePayment}>Proceed to Pay</button>
                        </div>
                    </>
                )}

                {step === 2 && clientSecret && (
                    <>
                        <h3 style={{marginBottom: '20px'}}>Secure Payment</h3>
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm onSuccess={handleBookingSuccess} />
                        </Elements>
                        <button className="btn-secondary" onClick={() => setStep(1)} style={{width: '100%', marginTop: '15px'}}>Cancel</button>
                    </>
                )}

                {step === 3 && (
                    <div style={{textAlign: 'center', padding: '40px 20px'}}>
                        <h2 style={{color: '#10b981', fontSize: '3rem'}}>🎉</h2>
                        <h3>Booking Confirmed!</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;