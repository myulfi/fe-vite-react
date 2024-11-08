import axios from 'axios'
import * as CommonConstants from "../constants/commonConstants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

const apiRequest = (method, url, params,) => {
    if (CommonConstants.METHOD.GET === method) {
        return api.get(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)}`
                },
                params: params
            })
    } else if (CommonConstants.METHOD.GET_BLOB === method) {
        return api.get(
            url,
            {
                headers: {
                    'Content-Type': 'text/csv',
                    'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)}`
                },
                params: params,
                responseType: "blob"
            }
        )
    } else if (CommonConstants.METHOD.POST === method) {
        return api.post(
            url,
            params,
            {
                headers: {
                    'Content-Type': params instanceof FormData ? 'multipart/form-data' : 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)}`
                }
            }
        )
    } else if (CommonConstants.METHOD.PUT === method) {
        return api.put(
            url,
            params,
            {
                headers: {
                    'Content-Type': params instanceof FormData ? 'multipart/form-data' : 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)}`
                }
            }
        )
    } else if (CommonConstants.METHOD.PATCH === method) {
        return api.patch(
            url,
            params,
            {
                headers: {
                    'Content-Type': params instanceof FormData ? 'multipart/form-data' : 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)}`
                }
            }
        )
    } else if (CommonConstants.METHOD.DELETE === method) {
        return api.delete(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)}`
                }
            }
        )
    } else {
        return null
    }
}

export { api, apiRequest }