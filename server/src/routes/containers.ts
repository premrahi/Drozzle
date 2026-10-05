import { Router, type Request, type Response } from "express";
import {
  listContainers,
  startContainer,
  stopContainer,
  restartContainer,
  getContainerStats,
} from "../dockerServices";

const containersRouter = Router();

const errMsg = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

// GET /containers - list all containers
containersRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const containers = await listContainers();
    res.json(containers);
  } catch (err) {
    console.error("Failed to list containers:", errMsg(err));
    res.status(500).json({ error: "Failed to list containers" });
  }
});

// GET /containers/:id/stats - live-ish CPU/memory snapshot
containersRouter.get("/:id/stats", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const stats = await getContainerStats(req.params.id);
    res.json(stats);
  } catch (err) {
    console.error("Failed to get stats:", errMsg(err));
    res.status(500).json({ error: "Failed to get container stats" });
  }
});

// POST /containers/:id/start
containersRouter.post("/:id/start", async (req: Request<{ id: string }>, res: Response) => {
  try {
    await startContainer(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to start container:", errMsg(err));
    res.status(500).json({ error: "Failed to start container" });
  }
});

// POST /containers/:id/stop
containersRouter.post("/:id/stop", async (req: Request<{ id: string }>, res: Response) => {
  try {
    await stopContainer(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to stop container:", errMsg(err));
    res.status(500).json({ error: "Failed to stop container" });
  }
});

// POST /containers/:id/restart
containersRouter.post("/:id/restart", async (req: Request<{ id: string }>, res: Response) => {
  try {
    await restartContainer(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to restart container:", errMsg(err));
    res.status(500).json({ error: "Failed to restart container" });
  }
});

export default containersRouter;
