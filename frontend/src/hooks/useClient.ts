import { useState } from 'react';

const BASE_URL = 'https://ews-mcr0.onrender.com';

interface ApiState {
  loading: boolean;
  error: string | null;
}

export function useClient() {
  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null,
  });

  const fetchClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    setState({ loading: true, error: null });
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setState({ loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  };

  return {
    loading: state.loading,
    error: state.error,
    fetchClient,
  };
}
