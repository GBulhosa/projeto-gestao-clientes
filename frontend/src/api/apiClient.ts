import axios from 'axios';
import { supabase } from '../context/supabaseClient';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor para adicionar token automaticamente
apiClient.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default apiClient;