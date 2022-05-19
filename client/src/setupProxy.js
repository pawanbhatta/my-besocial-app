const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api1", {
      target: "http://localhost:5000/api", // API endpoint 1
      changeOrigin: true,
      pathRewrite: {
        "^/api1": "",
      },
      headers: {
        Connection: "keep-alive",
      },
    })
  );
  app.use(
    createProxyMiddleware("/api2", {
      target: "http://localhost:8000/api", // API endpoint 2
      changeOrigin: true,
      pathRewrite: {
        "^/api2": "",
      },
      headers: {
        Connection: "keep-alive",
      },
    })
  );
};
