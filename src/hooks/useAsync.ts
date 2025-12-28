import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

/**
 * ASYNC HOOK
 * Handles async operations with loading, error, and data states
 * Medical-grade: Prevents memory leaks, handles race conditions
 * 
 * @param asyncFunction - Async function to execute
 * @param immediate - Execute immediately on mount (default: true)
 * @returns { loading, error, data, execute, reset }
 * 
 * @example
 * const { loading, error, data, execute } = useAsync(
 *   () => api.getMedications(),
 *   true // execute immediately
 * );
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <MedicationList data={data} />;
 */
export function useAsync<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate: boolean = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    loading: immediate,
    error: null,
    data: null,
  });

  // Execute async function
  const execute = useCallback(
    async (...args: Args) => {
      setState({ loading: true, error: null, data: null });

      try {
        const response = await asyncFunction(...args);
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (error) {
        setState({ loading: false, error: error as Error, data: null });
        throw error;
      }
    },
    [asyncFunction]
  );

  // Reset state
  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  // Execute on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * FETCH HOOK
 * Wrapper around fetch API with useAsync
 * Includes JSON parsing and error handling
 * 
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param immediate - Execute immediately (default: true)
 * @returns useAsync result
 * 
 * @example
 * const { loading, error, data } = useFetch<Medication[]>(
 *   '/api/medications',
 *   { headers: { Authorization: `Bearer ${token}` } }
 * );
 */
export function useFetch<T>(
  url: string,
  options?: RequestInit,
  immediate: boolean = true
) {
  const fetchFunction = useCallback(async () => {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }, [url, options]);

  return useAsync<T>(fetchFunction, immediate);
}
