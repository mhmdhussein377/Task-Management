export const showError = (name, message, setError) => {
    setError({isError: true, name, message});
    setTimeout(() => {
        setError({isError: false, name: "", message: ""});
    }, 3000);
};