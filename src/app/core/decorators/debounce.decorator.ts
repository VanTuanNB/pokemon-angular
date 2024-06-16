export function DebounceDecorator(delay = 500) {
    let timeout: any;
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originValue = descriptor.value;
        descriptor.value = function (...args: any[]) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                return originValue.apply(this, args);
            }, delay);
        };
    };
}
