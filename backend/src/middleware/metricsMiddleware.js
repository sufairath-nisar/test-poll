const client = require('prom-client');

const register = new client.Registry();

client.collectDefaultMetrics({ register });

// HTTP request duration histogram
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 300, 500, 750, 1000, 2000], 
});

// total requests counter
const httpRequestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// error requests counter
const httpRequestErrors = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of failed HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// number of in-flight requests
const inFlightRequests = new client.Gauge({
  name: 'http_in_flight_requests',
  help: 'Number of HTTP requests currently being handled',
});

register.registerMetric(httpRequestDurationMs);
register.registerMetric(httpRequestCount);
register.registerMetric(httpRequestErrors);
register.registerMetric(inFlightRequests);

function metricsMiddleware(req, res, next) {
  inFlightRequests.inc();
  const endTimer = httpRequestDurationMs.startTimer();

  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };
    httpRequestCount.inc(labels);
    endTimer(labels);
    inFlightRequests.dec();

    if (res.statusCode >= 400) {
      httpRequestErrors.inc(labels);
    }
  });

  next();
}

module.exports = { metricsMiddleware, register };
