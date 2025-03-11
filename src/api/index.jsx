import axios from 'axios'
import * as CommonConstants from "../constants/commonConstants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

const apiRequest = async (method, url, params,) => {
    let result = null
    let attemp = 0

    do {
        try {
            if (CommonConstants.METHOD.GET === method) {
                result = await api.get(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)}`
                        },
                        params: params
                    }
                )
            } else if (CommonConstants.METHOD.GET_BLOB === method) {
                result = await api.get(
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
                result = await api.post(
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
                result = await api.put(
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
                result = await api.patch(
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
                result = await api.delete(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)}`
                        }
                    }
                )
            }

            result = result.data
        } catch (error) {
            result = {
                status: error.status,
                message: error.response.data.message ?? error.message,
            }
        }

        if (
            attemp === 0
            && CommonConstants.HTTP_CODE.UNAUTHORIZED === result.status
        ) {
            try {
                const response = await api.post(
                    `/refresh-token.json`,
                    null,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem(CommonConstants.LOCAL_STORAGE.REFRESH_TOKEN)}`
                        }
                    }
                )

                if (CommonConstants.HTTP_CODE.OK === response.data.status) {
                    localStorage.setItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN, response.data.data.accessToken)
                    localStorage.setItem(CommonConstants.LOCAL_STORAGE.REFRESH_TOKEN, response.data.data.refreshToken)
                    localStorage.setItem(CommonConstants.LOCAL_STORAGE.NAME, response.data.data.user.nickName)
                    localStorage.setItem(CommonConstants.LOCAL_STORAGE.ROLE, response.data.data.user.roleList)
                }
            } catch {
                localStorage.removeItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)
                localStorage.removeItem(CommonConstants.LOCAL_STORAGE.REFRESH_TOKEN)
                localStorage.removeItem(CommonConstants.LOCAL_STORAGE.NAME)
                localStorage.removeItem(CommonConstants.LOCAL_STORAGE.ROLE)
                window.location.reload(false)
            }
        }
        attemp++
    } while (
        attemp < 2
        && CommonConstants.HTTP_CODE.UNAUTHORIZED === result.status
    )

    return result
}

export { api, apiRequest }