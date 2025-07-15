import { useState, useEffect, useReducer } from 'react';
import api from '../api/api';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, isError: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error('Unhandled action type');
  }
};

/**
 * @param {string|object|null} initialRequest - אם מחרוזת: נחשב כ-GET. אם אובייקט: יכול להכיל url, method, body.
 * @param {*} initialData
 */
const useDataApi = (initialRequest, initialData = null) => {
  const [request, setRequest] = useState(initialRequest);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    if (!request) return;

    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        let axiosConfig;

        if (typeof request === 'string') {
          // קריאת GET פשוטה
          axiosConfig = { method: 'GET', url: request };
        } else if (typeof request === 'object' && request.url) {
          const { url, method = 'GET', body = null, headers = {} } = request;
          axiosConfig = {
            url,
            method,
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            ...(body ? { data: body } : {}),
          };
        } else {
          throw new Error('Invalid request format passed to useDataApi');
        }

  
        const result = await api(axiosConfig);

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [request]);

  return [state, setRequest];
};

export default useDataApi;
