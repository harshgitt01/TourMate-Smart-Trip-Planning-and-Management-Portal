import { useEffect, useState } from 'react';
import { bookingApi, catalogApi } from '../api/axiosConfig';
import { getUserId, getToken } from '../utils/authUtils';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [packages, setPackages] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({ email: '', name: '' });

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const email = payload.sub;
                
                
                const namePart = email.split('@')[0];
                const formattedName = namePart
                    .split('.')
                    .map(n => n.charAt(0).toUpperCase() + n.slice(1))
                    .join(' ');

                setUserInfo({ email, name: formattedName });
            } catch (e) {
                console.error("Error decoding token", e);
            }
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const [bookingsRes, packagesRes] = await Promise.all([
                bookingApi.get(`/bookings/user/${userId}`),
                catalogApi.get('/packages') 
            ]);
            setBookings(bookingsRes.data);
            setPackages(packagesRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.config?.url?.includes('bookings')) {
                toast.error("Could not load your bookings.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getPackageDetails = (id) => {
        return packages.find(p => p.id === id);
    };

   
    const downloadTicket = async (bookingId) => {
        const ticketElement = document.getElementById(`ticket-${bookingId}`);
        if (!ticketElement) return;

        try {
            toast.loading("Generating Ticket...", { id: 'ticketGen' });
            
           
            const canvas = await html2canvas(ticketElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

           
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`TripSync-Ticket-${bookingId}.pdf`);
            
            toast.success("Ticket Downloaded!", { id: 'ticketGen' });
        } catch (error) {
            console.error(error);
            toast.error("Failed to download ticket.", { id: 'ticketGen' });
        }
    };

    if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

    return (
        <div className="container page-content">
            <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>My Trips ✈️</h2>
            
            {bookings.length === 0 ? (
                <div className="empty-state">
                    <p>No upcoming trips.</p>
                    <a href="/" className="btn-primary">Book Now</a>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => {
                        const pkg = getPackageDetails(booking.packageId);
                        const tripName = pkg ? pkg.packageName : `Trip #${booking.packageId}`;
                        const price = pkg ? pkg.price : '---';
                        const duration = pkg ? pkg.duration : '--';

                        return (
                            <div key={booking.id} className="ticket-wrapper">
                               
                                <div id={`ticket-${booking.id}`} className="ticket-card">
                                    
                                    
                                    <div className="ticket-left">
                                        <div className="ticket-brand">TripSync</div>
                                        <div className="ticket-header">
                                            <span className="label">PASSENGER</span>
                                            <span className="value">{userInfo.name}</span>
                                        </div>
                                        
                                        <div className="ticket-body">
                                            <div className="info-group">
                                                <span className="label">DESTINATION</span>
                                                <span className="value big">{tripName}</span>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-group">
                                                    <span className="label">DATE</span>
                                                    <span className="value">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="info-group">
                                                    <span className="label">DURATION</span>
                                                    <span className="value">{duration}</span>
                                                </div>
                                                <div className="info-group">
                                                    <span className="label">STATUS</span>
                                                    <span className={`value status-${booking.status.toLowerCase()}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ticket-footer">
                                            <p className="email-ref">{userInfo.email}</p>
                                        </div>
                                    </div>

                                    
                                    <div className="ticket-right">
                                        <div className="ticket-stub-content">
                                            <span className="label">BOOKING ID</span>
                                            <span className="value">#{booking.id}</span>
                                            
                                            <div className="price-tag">
                                                ₹{price}
                                            </div>

                                           
                                            <div className="barcode">
                                                ||| || ||| | ||||
                                            </div>
                                        </div>
                                    </div>
                                </div>

                              
                                <div className="ticket-actions">
                                    <button 
                                        className="btn-primary" 
                                        onClick={() => downloadTicket(booking.id)}
                                    >
                                        ⬇ Download Ticket
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;