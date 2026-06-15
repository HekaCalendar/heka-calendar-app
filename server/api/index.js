/**
 * Vercel / serverless entry point for the HEKA AI Proxy.
 *
 * The Express app is re-used as a request handler. Provider secrets are read
 * from environment variables configured in the hosting platform dashboard.
 */
const app = require('../ai-proxy.js');

module.exports = (req, res) => {
  app(req, res);
};
