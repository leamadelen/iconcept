import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import EditUserRoleModal from './EditUserRoleModal';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(true); // Track user authentication status
    const [showModal, setShowModal] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            setLoggedIn(false); // Set loggedIn state to false if token does not exist
            setLoading(false);
            console.log('User not authenticated');
            return;
        }

        // Fetch users if user is authenticated
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Include JWT token in headers
                }
            });
            console.log('Users:', response.data);
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Handle error
        }
    };

    const handleEditUserRole = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleDeleteUser = async (userIdToDelete) => {
        const confirmed = window.confirm("Er du sikker på at du vil slette denne brukeren?");
        if (confirmed) {
            try {
                await axios.delete(`/api/admin/${userIdToDelete}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Include JWT token in headers
                    }
                });
                // Remove the deleted user from the users state
                setUsers(users.filter(user => user.id !== userIdToDelete));
            } catch (error) {
                console.error('Error deleting user:', error);
                // Handle error
            }
        }
    };

    if (!loggedIn) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" />;
    }

    

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Admin</h2>
            <h4>Alle brukere</h4>
            {loading ? (
                <p>Laster inn...</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Navn</th>
                            <th>E-post</th>
                            <th>Rolle</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Ingen rolle'}</td>
                                <td>
                                    <button className="btn" style={{backgroundColor: '#FDA403'}} onClick={() => handleEditUserRole(user)}>Endre rolle</button>
                                </td>
                                <td>
                                    {user.id !== userId && ( // Check if the user is not the currently logged-in user
                                        <button className="btn" style={{backgroundColor: '#FF6969'}} onClick={() => handleDeleteUser(user.id)}>Slett bruker</button>
                                    )}
                                    {user.id === userId && ( // Check if the user is the currently logged-in user
                                        <h1>Kan ikke slette deg selv</h1>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && selectedUser && (
                <EditUserRoleModal
                    user={selectedUser}
                    closeModal={() => setShowModal(false)}
                    fetchUsers={fetchUsers} // Pass fetchUsers function to update user roles after editing
                />
            )}
        </div>
    );
};

export default AdminPanel;
