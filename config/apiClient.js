const axios = require("axios").default;

const client = axios.create({
  baseURL: process.env.API_URL,
});

const prepareDataToDB = (data) => {
  return JSON.stringify(data);
};

const apiClient = (url, data, requestHeader) => {
  let headers = {
    "Content-type": "application/json",
  };

  if (requestHeader) {
    headers = {
      ...headers,
      ...requestHeader,
    };
  }

  const get = async () => {
    const res = await client.get(url, { headers });
    return res.data;
  };

  const post = async () => {
    const res = await client.post(url, prepareDataToDB(data), { headers });
    return res.data;
  };

  // const put = () => {
  //   return client.put(url, data, {headers});
  // }

  // const del = () => {
  //   return client.delete(url, {headers});
  // }

  return {
    get,
    post,
  };
};

module.exports = { apiClient };
