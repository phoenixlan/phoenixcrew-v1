export const persistState = (storageKey, state) => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
};

/*export const removeState = (storageKey) => {
    window.localStorage.removeItem(storageKey);
};

export const getInitialState = (storageKey) => {
    const savedState = window.localStorage.getItem(storageKey);
    try {
        if (!savedState) {
            return undefined;
        }
        return JSON.parse(savedState);
    } catch (e) {
        console.error(`Failed to load state : ${storageKey}`);
        return undefined;
    }
};
*/