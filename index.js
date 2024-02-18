import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { editCloth, addCloth, deleteCloth, getClothes } from "./controllers/clothesController.js";


dotenv.config();

const app = express();
const router = Router();
const port = process.env.PORT || 3000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:4200";

// Cors configuration - Allows requests from localhost:4200
const corsOptions = {
  origin: clientOrigin,
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

// Use cors middleware
app.use(cors(corsOptions));

// Use express.json() middleware to parse JSON bodies of requests
app.use(express.json());
app.get("/", (req, res) => {

  return res.json({ "Message": "Hello World!" })
})

// GET route - Allows to get all the items
// example: localhost:3000/clothes?page=0&perPage=2
router.route("/").get(getClothes).post(addCloth);
router.route("/:id").put(editCloth).delete(deleteCloth);

app.use("/api/clothes", router);

// POST route - Allows to add a new item
// example: localhost:3000/clothes
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/

// PUT route - Allows to update an item
// example: localhost:3000/clothes/1
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/

// DELETE route - Allows to delete an item
// example: localhost:3000/clothes/1

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
})
