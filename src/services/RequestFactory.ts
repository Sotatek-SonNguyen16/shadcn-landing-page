import AuthRequest from './AuthRequest'

type RequestClasses = {
    AuthRequest: typeof AuthRequest
}

type RequestInstances = {
    [K in keyof RequestClasses]: InstanceType<RequestClasses[K]>
}

const instances: Partial<RequestInstances> = {}

class RequestFactory {
    static getRequest<K extends keyof RequestClasses>(classname: K): RequestInstances[K] {
        if (!instances[classname]) {
            instances[classname] = RequestFactory.createRequest(classname)
        }
        return instances[classname] as RequestInstances[K]
    }

    static createRequest<K extends keyof RequestClasses>(classname: K): RequestInstances[K] {
        switch (classname) {
            case 'AuthRequest':
                return new AuthRequest() as RequestInstances[K]
            default:
                throw new Error(`Unknown request class: ${classname}`)
        }
    }
}

export default RequestFactory
