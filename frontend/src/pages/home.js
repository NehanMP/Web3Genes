import React, { useEffect, useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext'

const UserDetails = ({ details }) => {
    return (
        <tr>
            <td>{details.basic_info.first_name}</td>
            <td>{details.basic_info.last_name}</td>
            <td>{new Date(details.basic_info.dob).toLocaleDateString()}</td>
            <td>{details.basic_info.gender}</td>
            <td>{details.contact_info.mobile_number}</td>
            <td>{details.contact_info.email}</td>
        </tr>
    );
};


const Home = () => {
    const [details, setDetails] = useState([]);
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/user/details', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setDetails(json);
            }
        };

        if (user) {
            fetchUsers();
        }
        
    }, [user]);

    return (
        <div className="home">

            <h1>User List</h1>
            <p>Lorem ipsum dolor sit amet consectetur. </p>

            <div className="details">
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date Of Birth</th>
                            <th>Gender</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((userDetail) => (
                            <UserDetails key={userDetail._id} details={userDetail}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;