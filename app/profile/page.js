'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ProfilePage() {

    const [user, setUser] = useState(null);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const fetchProfile = async () => {
            try {

                const response = await fetch('/api/protected', {
                    headers: {'Authorization': `Bearer ${accessToken}`}
                });

                if (!response.ok && !isRefreshing && refreshToken) {
                    setIsRefreshing(true);

                    const refreshResponse = await fetch('/api/refresh', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({refreshToken})
                    });

                    if (refreshResponse.ok) {
                        const {accessToken: newAccessToken} = await refreshResponse.json();

                        localStorage.setItem('accessToken', newAccessToken);

                        setIsRefreshing(false);

                        fetchProfile();
                    } else {
                        setIsRefreshing(false);

                        handleLogout();
                    }
                } else if (response.ok) {

                    const data = await response.json();

                    setUser(data);
                }
            } catch (error) {
                router.push('/login');
            }
        };

        if (!accessToken) {
            router.push('/login');
        } else {

            fetchProfile();
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        router.push('/login');
    };

    return (
        <div>
            <h1>Profile Page</h1>
            {user ? <p>Welcome, {user.username}!</p> : <p>Loading...</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}