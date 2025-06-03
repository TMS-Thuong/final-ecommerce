export const setCookie = (name: string, value: string, days: number = 7) => {
    try {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        const secure = window.location.protocol === 'https:' ? ';secure' : '';
        document.cookie = `${name}=${value};${expires};path=/;samesite=strict${secure}`;
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
};

export const getCookie = (name: string): string | null => {
    try {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    } catch (error) {
        console.error('Error getting cookie:', error);
        return null;
    }
};

export const removeCookie = (name: string) => {
    try {
        const secure = window.location.protocol === 'https:' ? ';secure' : '';
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;samesite=strict${secure}`;
    } catch (error) {
        console.error('Error removing cookie:', error);
    }
}; 