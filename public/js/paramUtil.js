/**
 * Expects hash in the URL like: http://localhost:8080/?2fd4e1c67a2d28fced849ee1bb76e7391b93eb12
 */
export function getParamFromUrl() {
    return document.location.search.substring(1);
}