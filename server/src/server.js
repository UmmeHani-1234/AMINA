const http = require("http");
require("dotenv").config();
const app = require("./app");
const {loadPlanetsData} = require("./models/planets.model");
const {connectDatabase} = require("./db");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
async function startServer(){
    await connectDatabase();
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listen to port ${PORT}`);
    });
}
startServer();