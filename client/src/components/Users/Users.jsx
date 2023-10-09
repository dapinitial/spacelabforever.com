import { useState, useEffect } from 'react';
import useFetchPrivate from '../../hooks/useFetchPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const Users = () => {
    const [users, setUsers] = useState();
    const fetchPrivate = useFetchPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const data = await fetchPrivate('/users', {
                    signal: controller.signal
                });

                isMounted && setUsers(data);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    navigate('/sign-in', {
                        state: { from: location },
                        replace: true
                    })
                }
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    return (
        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                    </ul>
                ) : <p>No users to display.</p>
            }
        </article>
    );
};

export default Users
