import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const InputForm = () => {
    const type = 'USER';
    const status = 'ONBOARD';
    const password = '';

    // Form inputs state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    // Modal and success message state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { user } = useAuthContext();

    // Show modal
    const handleShowModal = () => {
        setIsModalOpen(true);
    };

    // Confirm form submission
    const handleConfirm = async () => {
        setIsModalOpen(false);

        if (!user) {
            setError('You must be logged in');
            return;
        }

        const userData = {
            type,
            status,
            basic_info: {
                first_name: firstName,
                last_name: lastName,
                dob,
                gender,
            },
            contact_info: {
                mobile_number: mobileNumber,
                email,
            },
            auth_info: {
                password, 
            },
        };

        // Call API to submit form
        const response = await fetch('/api/user/new', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            // Clear fields after submitting
            setFirstName('');
            setLastName('');
            setDob('');
            setGender('');
            setEmail('');
            setMobileNumber('');
            
            setError(null);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000); // Show success message for 3 seconds
            console.log('New user added:', json);
        }
    };

    // Close modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Clear form inputs
    const handleClear = () => {
        setFirstName('');
        setLastName('');
        setDob('');
        setGender('');
        setMobileNumber('');
        setEmail('');
        setError(null);
    };

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Show confirmation modal
        handleShowModal(); 
    };

    return (
        <div className="home">
            <div className="form-container">
                {isModalOpen && (
                    <div className="modal">
                        <h2>Confirm</h2>
                        <p>Are you sure you want to proceed?</p>
                        <button onClick={handleCancel}>No</button>
                        <button onClick={handleConfirm}>Yes</button>
                    </div>
                )}

                {isModalOpen && (
                    <div className="overlay" onClick={(e) => e.stopPropagation()}></div>
                )}

                {showSuccess && (
                    <div className="success-banner">
                        User Added Successfully
                    </div>
                )}

                <div className="form-heading">
                    <h2>User Onboarding</h2>
                    <p>Lorem ipsum dolor sit amet consectetur.</p>
                </div>

                <form className="user-onboarding-form" onSubmit={handleSubmit} >

                <h4>Basic Details</h4>

                <div className="form-group">
                <input 
                    type="text" 
                    value={firstName} onChange={(e) => setFirstName(e.target.value)} 
                    placeholder="First Name" 
                />
                <input 
                    type="text" 
                    value={lastName} onChange={(e) => setLastName(e.target.value)} 
                    placeholder="Last Name" 
                />
                <input 
                    type="date" 
                    value={dob} onChange={(e) => setDob(e.target.value)} 
                />
                </div>
                
                <div className="form-group">
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="" disabled>Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>

                <h4>Contact Details</h4>

                <div className="form-group">
                <input 
                    type="tel" 
                    value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} 
                    placeholder="Mobile Number"
                />
                <input 
                    type="email" 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                />
                </div>
        
                <div className="form-buttons">
                    <button type="button" onClick={handleClear}>Clear</button>
                    <button type="button" onClick={handleShowModal}>Save</button>
                </div>

                {error && <div className='error'>{error}</div>}
            </form>
            </div>
        </div>
    );
};

export default InputForm;