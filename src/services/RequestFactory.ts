import MarketRequest from './MarketRequest';

type RequestClasses = {
    MarketRequest: typeof MarketRequest;
};

type RequestInstances = {
    [K in keyof RequestClasses]: InstanceType<RequestClasses[K]>;
};

const instances: Partial<RequestInstances> = {};

class RequestFactory {
    static getRequest<K extends keyof RequestClasses>(classname: K): RequestInstances[K] {
        if (!instances[classname]) {
            instances[classname] = RequestFactory.createRequest(classname);
        }
        return instances[classname] as RequestInstances[K];
    }

    static createRequest<K extends keyof RequestClasses>(classname: K): RequestInstances[K] {
        switch (classname) {
            case 'MarketRequest':
                return new MarketRequest();
            default:
                throw new Error(`Unknown request class: ${classname}`);
        }
    }
}

export default RequestFactory;
