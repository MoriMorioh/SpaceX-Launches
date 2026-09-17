export const initialState = {
    launches: [],
    loading: false,
    error: null,
    selectedLaunch: null,
};
export function launchesReducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                launches: Array.isArray(action.payload) ? action.payload : [],
            };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'SELECT_LAUNCH':
            return { ...state, selectedLaunch: action.payload };
        case 'CLOSE_MODAL':
            return { ...state, selectedLaunch: null };
        default:
            return state;
    }
}
