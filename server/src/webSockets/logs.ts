import type { IncomingMessage, Server as HttpServer } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import { getLogStream } from "../dockerServices.js";

export function attachLogSocket(httpServer: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    const match = req.url?.match(/^\/ws\/logs\/([a-zA-Z0-9_-]+)/);
    if (!match) {
      socket.destroy();
      return;
    }
    const containerId = match[1];

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req, containerId);
    });
  });

  wss.on("connection", async (ws: WebSocket, _req: IncomingMessage, containerId: string) => {
    let dockerStream: NodeJS.ReadableStream;

    try {
      dockerStream = await getLogStream(containerId);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      ws.send(`ERROR: could not attach to container logs (${message})`);
      ws.close();
      return;
    }

    dockerStream.on("data", (chunk: Buffer) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(chunk.toString("utf8"));
      }
    });

    dockerStream.on("error", (err: Error) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(`ERROR: ${err.message}`);
      }
    });

    ws.on("close", () => {
      (dockerStream as NodeJS.ReadableStream & { destroy?: () => void }).destroy?.();
    });
  });

  return wss;
}
