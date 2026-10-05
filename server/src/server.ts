import express from "express";
import cors from "cors";
import http from "http" ;
import { attachLogSocket } from "./webSockets/logs";
import containersRouter from "./routes/containers";


const app = express();
const PORT = process.env.port || 5000;

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


