export async function apiRequest(path, {
    method = 'GET',
    token = null,
    body = null
} = {}) {

    const headers = {};
    if (token != null)
        headers['Authorization'] =`Bearer ${token}`;
    if (body != null)
        headers['Content-Type'] = 'application/json';

    const response = await fetch(`/api${path}`, {
        method,
        headers,
        body: body !== null ? JSON.stringify(body) : undefined
    });
    
    const data = await response.json();
    if(response.ok === false){
        throw new Error(data.message || 'Request failed');
    }else{
        return data;
    }
}