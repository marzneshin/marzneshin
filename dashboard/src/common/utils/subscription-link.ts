
export const getSubscriptionLink = (url: string) => String(url).startsWith('/')
    ? window.location.origin + url
    : String(url);
