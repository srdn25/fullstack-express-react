import axios, { AxiosPromise } from 'axios';
import { HTTP_REQUEST_TIMEOUT } from '../utils/consts';
import { ITaskBase, ITaskUpdate } from '../redux/reducer/task';

const api = axios.create({
    baseURL: 'http://localhost:3030',
    timeout: HTTP_REQUEST_TIMEOUT,
});

async function requestCatch (request: AxiosPromise) {
    let data = null;
    try {
        const response = await request;
        data = response.data;
    } catch (error) {
        console.error(error);
    }

    return data;
}

export default {
    api,
    createTask: (payload: ITaskBase) => requestCatch(api.post('/task', payload)),
    updateTask: (id: number|string, payload: ITaskUpdate) => requestCatch(api.put(`/task/${id}`, payload)),
    deleteTask: (id: number|string) => requestCatch(api.delete(`/task/${id}`)),
};