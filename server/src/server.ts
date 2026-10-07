import express from "express";
import cors from "cors";
import http from "http" ;
import { attachLogSocket } from "./webSockets/logs.js";
import containersRouter from "./routes/containers.js";


const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ message: "server is running fine!" , ok:true });
});
app.use("/containers", containersRouter);


const server = http.createServer(app) ;
attachLogSocket(server) ;


server.listen(PORT , () => {
  console.log(`server is up at port : ${PORT}`);
});


