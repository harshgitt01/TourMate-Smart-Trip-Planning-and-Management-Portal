import { useState, useEffect } from 'react';
import { catalogApi } from '../api/axiosConfig';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('destination'); // Toggle between forms
    const [destinationsList, setDestinationsList] = useState([]); // For the dropdown

    // --- State for Destination Form ---
    const [destination, setDestination] = useState({
        name: '',
        country: '',
        location: '',
        description: ''
    });

    // --- State for Package Form ---
    const [tourPackage, setTourPackage] = useState({
        packageName: '',
        price: '',
        duration: '',
        availableSlots: '',
        destinationId: '' // We need this to link them
    });

    // 1. Fetch Destinations on Load (for the Dropdown)
    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await catalogApi.get('/destinations');
            setDestinationsList(response.data);
        } catch (error) {
            console.error("Error loading destinations for dropdown", error);
        }
    };

    // --- Handlers for Destination Form ---
    const handleDestChange = (e) => {
        setDestination({ ...destination, [e.target.name]: e.target.value });
    };

    const handleDestSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Adding destination...');
        try {
            await catalogApi.post('/destinations', destination);
            toast.success('Destination Added!', { id: toastId });
            setDestination({ name: '', country: '', location: '', description: '' });
            fetchDestinations(); // Refresh dropdown list
        } catch (error) {
            toast.error('Failed to add destination.', { id: toastId });
        }
    };

    // --- Handlers for Package Form ---
    const handlePackageChange = (e) => {
        setTourPackage({ ...tourPackage, [e.target.name]: e.target.value });
    };

    const handlePackageSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Adding package...');

        // 2. Format Data to match Backend JSON Structure
        const payload = {
            packageName: tourPackage.packageName,
            price: parseFloat(tourPackage.price),
            duration: tourPackage.duration,
            availableSlots: parseInt(tourPackage.availableSlots),
            destination: {
                id: parseInt(tourPackage.destinationId) // Nested Object
            }
        };

        try {
            await catalogApi.post('/packages', payload);
            toast.success('Package Added!', { id: toastId });
            setTourPackage({ packageName: '', price: '', duration: '', availableSlots: '', destinationId: '' });
        } catch (error) {
            console.error(error);
            toast.error('Failed to add package. Check inputs.', { id: toastId });
        }
    };

    return (
        <div className="container">
            <Toaster position="top-right" />
            
            {/* Header */}
            <div className="admin-header">
                <h1>Admin Panel</h1>
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            {/* 3. Tab Navigation */}
            <div className="admin-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'destination' ? 'active' : ''}`}
                    onClick={() => setActiveTab('destination')}
                >
                    Add Destination
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'package' ? 'active' : ''}`}
                    onClick={() => setActiveTab('package')}
                >
                    Add Tour Package
                </button>
            </div>

            <div className="card admin-card">
                {/* --- FORM 1: ADD DESTINATION --- */}
                {activeTab === 'destination' && (
                    <form onSubmit={handleDestSubmit}>
                        <h2>Add New Destination</h2>
                        <label>Destination Name</label>
                        <input name="name" value={destination.name} onChange={handleDestChange} required placeholder="e.g. Kyoto" />

                        <label>Country</label>
                        <input name="country" value={destination.country} onChange={handleDestChange} required placeholder="e.g. Japan" />

                        <label>Location / Region</label>
                        <input name="location" value={destination.location} onChange={handleDestChange} required placeholder="e.g. Asia" />

                        <label>Description</label>
                        <textarea name="description" value={destination.description} onChange={handleDestChange} required rows="3" />

                        <button type="submit" className="btn-submit">Add Destination</button>
                    </form>
                )}

                {/* --- FORM 2: ADD TOUR PACKAGE --- */}
                {activeTab === 'package' && (
                    <form onSubmit={handlePackageSubmit}>
                        <h2>Add New Tour Package</h2>
                        
                        {/* Dropdown to select Destination */}
                        <label>Select Destination</label>
                        <select 
                            name="destinationId" 
                            value={tourPackage.destinationId} 
                            onChange={handlePackageChange} 
                            required
                            className="form-select"
                        >
                            <option value="">-- Choose a Destination --</option>
                            {destinationsList.map(dest => (
                                <option key={dest.id} value={dest.id}>
                                    {dest.name} ({dest.country})
                                </option>
                            ))}
                        </select>

                        <label>Package Name</label>
                        <input name="packageName" value={tourPackage.packageName} onChange={handlePackageChange} required placeholder="e.g. Dubai Luxury Trip" />

                        <label>Price (₹)</label>
                        <input name="price" type="number" value={tourPackage.price} onChange={handlePackageChange} required placeholder="e.g. 95000" />

                        <label>Duration</label>
                        <input name="duration" value={tourPackage.duration} onChange={handlePackageChange} required placeholder="e.g. 4 Days" />

                        <label>Available Slots</label>
                        <input name="availableSlots" type="number" value={tourPackage.availableSlots} onChange={handlePackageChange} required placeholder="e.g. 15" />

                        <button type="submit" className="btn-submit">Add Package</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;