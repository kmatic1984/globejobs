import axios from 'axios';

const RAPIDAPI_KEY = 'YOUR_RAPIDAPI_KEY';
const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';

const jobApiClient = axios.create({
    baseURL: `https://${RAPIDAPI_HOST}/`,
    headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
});

export const fetchJobs = async (query, location) => {
    try {
        const response = await jobApiClient.get('/search', {
            params: { query, location },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};
