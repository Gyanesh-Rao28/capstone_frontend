import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// import { ExtendedUserType } from '../types/extended';

import { apiClient } from '../libs/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { UserType } from '../types/auth';
// import { UserAdmin } from '../types/admin';
// import { UserFaculty } from '../types/faculty';
// import { UserStudent } from '../types/student';


export function useAuth() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: user, isLoading } = useQuery<UserType| null>({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No token found');
            }

            try {
                const { data } = await apiClient.get < UserType |  null>('/api/auth/user/me');
                console.log(data)
                return data;
            } catch (error) {
                // Type guard for AxiosError
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        localStorage.removeItem('accessToken');
                    }
                }
                throw error;
            }
        },
        retry: false,
        enabled: !!localStorage.getItem('accessToken'),
    });

    const googleLogin = () => {
        window.location.href = 'http://localhost:8000/auth/google';
    };
 
    const handleAuthCallback = async (token: string) => {
        try {
            localStorage.setItem('accessToken', token);
            await queryClient.invalidateQueries({ queryKey: ['auth-user'] });
            toast.success("Logged In", {
                position: "top-right"
            })
            navigate('/dashboard');
        } catch (error) {
            console.error('Auth callback error:', error);
            navigate('/login');
        }
    };

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            localStorage.removeItem('accessToken');
            queryClient.setQueryData(['auth-user'], null);
        },
        onSuccess: () => {
            navigate('/login');
        },
    });

    return {
        user,
        isLoading,
        handleAuthCallback,
        isAuthenticated: !!localStorage.getItem('accessToken') && !!user,
        googleLogin,
        logout,
    };
}