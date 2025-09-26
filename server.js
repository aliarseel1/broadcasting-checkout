import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { randomUUID } from "crypto";
import { readJSON, addToJSON, removeFromJSON } from "./modules/jsonHelper.js";

const app = express();
const PORT = 3000;

const items = {
  bc01: "Big Camera 1 (BC01)",
  bc02: "Big Camera 2 (BC02)",
  bc03: "Big Camera 3 (BC03)",
  sc01: "Small Camera 1 (SC01)",
  sc02: "Small Camera 2 (SC02)",
  sc03: "Small Camera 3 (SC03)",
  wlm01: "Wireless Lavalier Microphone 1 (WLM01)",
  wlm02: "Wireless Lavalier Microphone 2 (WLM02)",
  hhm01: "Handheld Microphone 1 (HHM01)",
  hhm02: "Handheld Microphone 2 (HHM02)",
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const path = "./data/checkouts.json";
  const checkouts = (await readJSON(path)) || [];
  res.render("index", { outstanding: checkouts.length });
});

app.get("/checkin", async (req, res) => {
  const path = "./data/checkouts.json";
  const checkouts = (await readJSON(path)) || [];
  res.render("checkin", { data: checkouts, outstanding: checkouts.length });
});

app.post("/post-checkout", async (req, res) => {
  const path = "./data/checkouts.json";
  const equipment = Object.entries(req.body)
    .filter(([key, value]) => key.startsWith("item-") && value === "on")
    .map(([key]) => {
      const shortKey = key.replace("item-", "");
      return items[shortKey];
    });

  const newCheckout = {
    id: randomUUID(),
    name: req.body.name,
    equipment: equipment,
    location: req.body.location,
    duration: req.body.duration,
    reason: req.body.reason,
    timestamp: new Date().toLocaleString(),
  };
  await addToJSON(path, newCheckout);
  res.redirect("/checkin");
});

app.get("/checkin/data", async (req, res) => {
  const path = "./data/checkouts.json";
  const checkouts = (await readJSON(path)) || [];
  res.json({ checkouts, outstanding: checkouts.length });
});

app.get("/count", async (req, res) => {
  const path = "./data/checkouts.json";
  const checkouts = (await readJSON(path)) || [];
  res.json({ outstanding: checkouts.length });
});

app.delete("/checkin/:id", async (req, res) => {
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, "data", "checkouts.json");
  const id = req.params.id;
  const success = await removeFromJSON(filePath, id);
  res.json({ success });
});

app.listen(PORT, () => {
  console.log(`Server is running and active at http://localhost:${PORT}`);
});
