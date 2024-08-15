import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import config from '@/configs'
import {
    setAuthorizationToRequest,
    setDefaultAuthorizationToRequest
} from '@/lib/authenticate.ts'
import Storage from '@/lib/storage'

interface RequestParams {
    [key: string]: number | string
}

interface RequestData {
    [key: string]: number | string | string[] | number[]
}

interface ErrorResponse {
    response?: {
        status?: number
        data?: {
            message?: string | object
            data?: {
                message?: string
            }
        }
    }
}

export default class BaseRequest {
    constructor() {
        const accessToken = Storage.getAccessToken()
        if (accessToken !== undefined) {
            setAuthorizationToRequest(accessToken)
        } else {
            setDefaultAuthorizationToRequest()
        }
    }

    async get<T>(
        url: string,
        params?: RequestParams
    ): Promise<T | undefined | null> {
        try {
            const config: AxiosRequestConfig = {
                params
            }
            const response: AxiosResponse = await axios.get(
                this.getUrlPrefix() + url,
                config
            )
            return this._responseHandler(response)
        } catch (error) {
            throw await this._errorHandler(error as ErrorResponse)
        }
    }

    async put(url: string, data: RequestData): Promise<unknown> {
        try {
            const response: AxiosResponse = await axios.put(
                this.getUrlPrefix() + url,
                data
            )
            return this._responseHandler(response)
        } catch (error) {
            return this._errorHandler(error as ErrorResponse)
        }
    }

    async patch(url: string, data: RequestData): Promise<unknown> {
        try {
            const response: AxiosResponse = await axios.patch(
                this.getUrlPrefix() + url,
                data
            )
            return this._responseHandler(response)
        } catch (error) {
            return this._errorHandler(error as ErrorResponse)
        }
    }

    async post<T>(
        url: string,
        data: RequestData
    ): Promise<T | undefined | null> {
        try {
            const response: AxiosResponse = await axios.post(
                this.getUrlPrefix() + url,
                data
            )
            return this._responseHandler(response)
        } catch (error) {
            throw await this._errorHandler(error as ErrorResponse)
        }
    }

    async delete(url: string, data?: RequestData): Promise<unknown> {
        try {
            const config: AxiosRequestConfig = {
                data
            }
            const response: AxiosResponse = await axios.delete(
                this.getUrlPrefix() + url,
                config
            )
            return this._responseHandler(response)
        } catch (error) {
            return this._errorHandler(error as ErrorResponse)
        }
    }

    async download(url: string, data?: RequestData): Promise<unknown> {
        try {
            const config: AxiosRequestConfig = {
                ...data,
                responseType: 'blob'
            }
            const response: AxiosResponse = await axios.get(
                this.getUrlPrefix() + url,
                config
            )
            return this._responseHandler(response)
        } catch (error) {
            return this._errorHandler(error as ErrorResponse)
        }
    }

    private getUrlPrefix(): string {
        return config.app.apiUrl
    }

    private _responseHandler<T>(response: AxiosResponse<T>): T {
        return response.data
    }

    private _error403Handler(): null {
        // TODO: make broadcast event
        return null
    }

    private _error401Handler(): null {
        // TODO: make broadcast event
        return null
    }

    private async _errorHandler(err: ErrorResponse): Promise<undefined | null> {
        if (
            err.response?.status === 401 &&
            err.response.data?.message !== 'Credential is not correct'
        ) {
            return this._error401Handler()
        }

        if (err.response?.status === 403) {
            return this._error403Handler()
        }

        if (err.response?.data?.data?.message) {
            if (typeof err.response.data.data.message === 'string') {
                throw new Error(err.response.data.data.message)
            }
        }

        if (err.response?.data?.message) {
            if (typeof err.response.data.message === 'object') {
                throw new Error(JSON.stringify(err.response.data.message))
            }
        }
    }
}
