import dotenv from "dotenv";
dotenv.config();

import express, { urlencoded } from "express";
import { doSomeHeavyTask } from "./utils/heavy-task.js";
import { collectDefaultMetrics } from "./utils/prom.js";
import responseTime from "response-time";
import client from "prom-client";
import { rollTheDice } from "./utils/rolldice.js";

const app = express();
const PORT = process.env.PORT || 4000;

const reqResTime = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "This tells how much time is taken by req and res",
  labelNames: ["method", "path", "status_code"],
  buckets: [1, 10, 30, 60, 80, 100, 120, 150, 190],
});

const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "path", "status_code"],
});

const requestDurationSummary = new client.Summary({
  name: "http_request_duration_summary_seconds",
  help: "Summary of the duration of HTTP requests in seconds",
  labelNames: ["method", "path", "status_code"],
  percentiles: [0.5, 0.9, 0.99],
});

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  responseTime((req, res, time) => {
    reqResTime
      .labels({
        method: req?.method || "",
        path: req?.url || "",
        status_code: res.statusCode,
      })
      .observe(time);
    requestDurationSummary
      .labels({
        method: req?.method || "",
        path: req?.url || "",
        status_code: res.statusCode,
      })
      .observe(time);
  })
);

collectDefaultMetrics({ register: client.register });

app.get("/", async (req, res) => {
  res.json({ msg: "hello" });
});

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  requestCounter
    .labels({
      method: req?.method || "",
      path: req?.url || "",
      status_code: res.statusCode,
    })
    .inc();
  res.send(metrics);
});

app.get("/slow", async (req, res) => {
  try {
    const timeTaken = await doSomeHeavyTask();
    res.status(200).json({
      status: "Success",
      msg: `Heavy task completed in ${timeTaken}`,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      error: "Internal Server Error",
    });
  } finally {
    requestCounter
      .labels({
        method: req?.method || "",
        path: req?.url || "",
        status_code: res.statusCode,
      })
      .inc();
  }
});

app.get("/rolldice", (req, res) => {
  const rolls = req.query?.rolls ? parseInt(req.query.rolls.toString()) : NaN;
  if (isNaN(rolls)) {
    return res
      .status(400)
      .send("Request parameter 'rolls' is missing or not a number.");
  }
  res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
});

app.listen(PORT, () => {
  console.log("Server connected successfully on port no", PORT);
});
