let dev = {
  // baseUrl: "http://200.1.3.190:12617/api"
  baseUrl: "http://yd.xinhuahanpin.com/api"
};

let prod = {
  // baseUrl: "http://200.1.3.89:1666/api"
  baseUrl: "http://yd.xinhuahanpin.com/api"
};

const env = process.env.NODE_ENV;

let Api;

if (env === "development") {
  Api = dev;
} else {
  Api = prod;
}

export default Api;
