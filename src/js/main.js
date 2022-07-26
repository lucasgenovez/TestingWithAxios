const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(function(config) {
    config.headers.common.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    return config;
}, function (error) {
    console.log('error');
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    console.log('sucesso');
    return response;
}, function (error) {
    console.log(error.response);
    return Promise.reject(error);
});

const get = async () => {
    try {
        const config = {
            params: {
                _limit: 2
            }
        };

        const response = await axios.get('/posts', config);

        renderOutput(response);
    } catch (error) {
        renderOutput(error);
    }
}

const post = async () => {
    try {
        const data = {
            title: 'foo',
            body: 'bar',
            userId: 1,
        };

        const response = await axios.post('/posts', data);

        renderOutput(response);
    } catch (error) {
        renderOutput(error);
    }
}

const put = async () => {
    try {
        //Updating a resource
        const data = {
            id: 1,
            title: 'foo',
            body: 'bar',
            userId: 1,
        };

        const response = await axios.put('/posts/1', data);

        renderOutput(response);
    } catch (error) {
        renderOutput(error);
    }
}

const patch = async () => {
    try {
        //Patching a resouce
        const data = {
            title: 'LaraVue'
        };

        const response = await axios.put('/posts/1', data);

        renderOutput(response);
    } catch (error) {
        renderOutput(error);
    }
}

const del = async () => {
    try {
        //Patching a resouce
        const data = {
            title: 'LaraVue'
        };

        const response = await axios.delete('/posts/2', data);

        renderOutput(response);
    } catch (error) {
        renderOutput(error);
    }
}

const multiple = async () => {
    try {
        const response = await Promise.all([
            axios.get('/posts'),
            axios.get('/users')
        ]);

        console.table(response[0].data);
        console.table(response[1].data);
    } catch (error) {
        console.log(error);
    }
}

const transform = async () => {
    try {
        const config = {
            params: {
                _limit: 2
            },
            transformResponse: [function (data) {
                const payload = JSON.parse(data).map(p => {
                    return {
                        ...p,
                        fisrt_name: 'Lucas',
                        last_name: 'Genovez',
                        full_name: 'Lucas Genovez'
                    }
                });

                return payload;
            }],
        };

        const response = await axios.get('/posts', config);

        renderOutput(response);
    } catch (error) {
        renderOutput(error);
    }
}

const errorHandling = () => {

    const config = {
        params: {
            _limit: 2
        }
    };

    axios.get('/postsr', config)
        .then((response) => renderOutput(response))
        .catch((error) =>  renderOutput(error.response));
}

const cancel = () => {
    const controller = new AbortController();
    const config = {
        params: {
            _limit: 5
        },
        signal: controller.signal
    };
    axios.get('/posts', config)
        .then((response) => renderOutput(response))
        .catch((e) => {
            console.log(e.message);
        })

    controller.abort()
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
