export default function request(url, option) {
  const options = {
    ...option,
  };

  const defaultOptions = {
    credentials: 'include',
    mode: 'cors',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: '*',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      // newOptions.body = stringify(newOptions.body, { arrayFormat: 'brackets' });
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return (
    fetch(url, newOptions)
      .then(response => {
        if (newOptions.method === 'DELETE' || response.status === 204) {
          return response.text();
        }
        return response.json();
      })
      .catch(e => {
        const status = e.name;
        if (status === 401) {
          return;
        }
        // environment should not be used
        if (status === 403) {
          // router.push('/exception/403');
          return;
        }
        if (status <= 504 && status >= 500) {
          // router.push('/exception/500');
          return;
        }
        if (status >= 404 && status < 422) {
          // router.push('/exception/404');
        }
      })
  );
}