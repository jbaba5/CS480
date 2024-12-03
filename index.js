const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json()); // To parse JSON body
app.use(express.urlencoded({ extended: true }));
// MySQL Connection (Sakila Database)

const mysqlConnection = mysql.createConnection({
  host: "34.173.123.230",
  port: "3306",
  user: "cs480-remote-admin",
  database: "sakila",
  password: "jbaba5",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error("MySQL connection error: ", err);
    process.exit(1);
  }
  console.log("Connected to MySQL (Sakila)");
});

// Replace the placeholder with your Atlas connection string
const uri =
  "mongodb+srv://jbaba5:JB-CS480@jb-cs480.rbvyw.mongodb.net/?retryWrites=true&w=majority&appName=JB-CS480";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// ----------- MySQL Endpoints (Sakila) -----------

// GET /api/v1/actors
app.get("/api/v1/actors", (req, res) => {
  mysqlConnection.query("SELECT * FROM actor", (err, results) => {
    if (err) return res.json(["An error has occurred."]);
    res.json(results);
  });
});

// GET /api/v1/actors/:id
app.get("/api/v1/actors/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM actor WHERE actor_id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0)
        return res.json(["An error has occurred."]);
      res.json(results[0]);
    },
  );
});

// GET /api/v1/actors/:id/films
app.get("/api/v1/actors/:id/films", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT f.* FROM film f JOIN film_actor fa ON f.film_id = fa.film_id WHERE fa.actor_id = ?",
    [id],
    (err, results) => {
      if (err) return res.json(["An error has occurred."]);
      res.json(results);
    },
  );
});

// GET /api/v1/actors/:id/detail (from actor_info view)
app.get("/api/v1/actors/:id/detail", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM actor_info WHERE actor_id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0)
        return res.json(["An error has occurred."]);
      res.json(results[0]);
    },
  );
});

// GET /api/v1/films
app.get("/api/v1/films", (req, res) => {
  const { query } = req.query;
  let sql = "SELECT * FROM film";
  if (query) {
    sql += ` WHERE title LIKE '%${query}%'`;
  }
  mysqlConnection.query(sql, (err, results) => {
    if (err) return res.json(["An error has occurred."]);
    res.json(results);
  });
});

// GET /api/v1/films/:id
app.get("/api/v1/films/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM film WHERE film_id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0)
        return res.json(["An error has occurred."]);
      res.json(results[0]);
    },
  );
});

// GET /api/v1/films/:id/actors
app.get("/api/v1/films/:id/actors", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT a.* FROM actor a JOIN film_actor fa ON a.actor_id = fa.actor_id WHERE fa.film_id = ?",
    [id],
    (err, results) => {
      if (err) return res.json(["An error has occurred."]);
      res.json(results);
    },
  );
});

// GET /api/v1/films/:id/detail (from film_list view)
app.get("/api/v1/films/:id/detail", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM film_list WHERE FID = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0)
        return res.json(["An error has occurred."]);
      res.json(results[0]);
    },
  );
});

// GET /api/v1/customers
app.get("/api/v1/customers", (req, res) => {
  mysqlConnection.query("SELECT * FROM customer", (err, results) => {
    if (err) return res.json(["An error has occurred."]);
    res.json(results);
  });
});

// GET /api/v1/customers/:id
app.get("/api/v1/customers/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM customer WHERE customer_id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0)
        return res.json(["An error has occurred."]);
      res.json(results[0]);
    },
  );
});

// GET /api/v1/customers/:id/detail (from customer_list view)
app.get("/api/v1/customers/:id/detail", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM customer_list WHERE ID = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0)
        return res.json(["An error has occurred."]);
      res.json(results[0]);
    },
  );
});

// GET /api/v1/stores
app.get("/api/v1/stores", (req, res) => {
  mysqlConnection.query("SELECT * FROM store", (err, results) => {
    if (err) return res.json(["An error has occurred."]);
    res.json(results);
  });
});

// GET /api/v1/stores/:id
app.get("/api/v1/stores/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM store WHERE store_id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0)
        return res.json(["An error has occurred."]);
      res.json(results[0]);
    },
  );
});

// GET /api/v1/inventory-in-stock/:film_id/:store_id
app.get("/api/v1/inventory-in-stock/:film_id/:store_id", (req, res) => {
  const { film_id, store_id } = req.params;
  mysqlConnection.query(
    "CALL film_in_stock(?, ?,@film_count)",
    [film_id, store_id],
    (err, results) => {
      if (err) return res.json(["An error has occurred."]);
      res.json(results[0]);
    },
  );
});

// GET /movies (from sample_mflix.movies collection)
// app.get("/api/v1/movies", async (req, res) => {
//   try {
//     const { genre, year, director } = req.query;

//     const database = client.db("sample_mflix");
//     const collection = database.collection("movies");

//     let query = {};

//     // Optional filters
//     if (genre) query.genre = genre;
//     if (year) query.year = parseInt(year);
//     if (director) query.director = { $regex: director, $options: "i" }; // Case-insensitive regex for director

//     const movies = await collection.find(query).limit(10).toArray(); // Limit to 10 documents
//     res.json(movies);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to fetch movies", details: err.message });
//   }
// });

app.get('/api/v1/movies', async (req, res) => {
  try {
    const database = client.db('sample_mflix');
    const collection = database.collection('movies');

    // Initialize an empty query object
    const query = {};

    // Iterate over the query parameters and build the query object
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        const value = req.query[key];

        // Handle numeric fields
        if (['year', 'runtime', 'num_mflix_comments', 'imdb.votes', 'imdb.id'].includes(key)) {
          query[key] = parseInt(value, 10); // Convert to integer
        } 
        // Handle imdb rating as a float
        else if (key === 'imdb.rating') {
          query[key] = parseFloat(value); // Convert to float
        } 
        // Handle array fields
        else if (Array.isArray(value)) {
          query[key] = { $in: value }; // Use $in operator for array fields
        } 
        // Handle string fields
        else {
          query[key] = { $regex: new RegExp(value, 'i') }; // Use regex for case-insensitive search
        }
      }
    }

    // Retrieve movies with a limit of 10 documents
    const movies = await collection.find(query).limit(10).toArray();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies', details: err.message });
  }
});


// GET /colors (from sample_colors.colors collection)
app.get("/api/v1/colors", async (req, res) => {
  try {
    const database = client.db("colors");
    const collection = database.collection("colorsCollection");

    const colors = await collection.find({}).toArray(); // Retrieve all color documents
    res.json(colors);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch colors", details: err.message });
  }
});

// POST /colors (Insert a new color)
app.post("/api/v1/colors", async (req, res) => {
  try {
    const database = client.db("colors");
    const collection = database.collection("colorsCollection");

    const newColor = req.body; // Assume the new color data is passed in the request body

    const result = await collection.insertOne(newColor);
    res.status(201).json(result.ops[0]); // Return the inserted color
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to insert color", details: err.message });
  }
});

// GET /colors/:id (Get color by ID)
app.get("/api/v1/colors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const database = client.db("colors");
    const collection = database.collection("colorsCollection");

    const color = await collection.findOne({ _id: new ObjectId(id) }); // Convert string id to ObjectId
    if (!color) {
      return res.status(404).json({ error: "Color not found" });
    }

    res.json(color);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch color", details: err.message });
  }
});

// PUT /colors/:id (Update color by ID)
app.put("/api/v1/colors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedColor = req.body;

    const database = client.db("colors");
    const collection = database.collection("colorsCollection");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedColor },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Color not found" });
    }

    const color = await collection.findOne({ _id: new ObjectId(id) });
    res.json(color); // Return the updated color
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update color", details: err.message });
  }
});

// DELETE /colors/:id (Delete color by ID)
app.delete("/api/v1/colors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const database = client.db("colors");
    const collection = database.collection("colorsCollection");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Color not found" });
    }

    res.json({ message: "Color deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete color", details: err.message });
  }
});

// ----------- MongoDB Endpoints (Sample Mflix & Colors) -----------

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
