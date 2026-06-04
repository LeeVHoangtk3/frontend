const BACKEND_URL = process.env.REACT_APP_API_URL || "";

function fetchModel(url) {
  // 2. Nối BACKEND_URL vào trước url
  return fetch(BACKEND_URL + url).then((res) => {
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    return res.json();
  });
}

export default fetchModel;
