import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertFileSchema } from "@shared/schema";
import { getTemplateFiles } from "./templates";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const createSchema = insertProjectSchema.pick({
        name: true,
        description: true,
        template: true,
      });
      
      const parsed = createSchema.parse(req.body);
      
      const project = await storage.createProject({
        name: parsed.name,
        description: parsed.description || null,
        template: parsed.template,
        userId: null,
      });

      // Create template files for the project
      const templateFiles = getTemplateFiles(project.template, project.id);
      for (const file of templateFiles) {
        await storage.createFile(file);
      }

      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const updateSchema = insertProjectSchema.partial().pick({
        name: true,
        description: true,
      });
      
      const parsed = updateSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, parsed);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Files API
  app.get("/api/projects/:id/files", async (req, res) => {
    try {
      const files = await storage.getFiles(req.params.id);
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      const createSchema = insertFileSchema.pick({
        projectId: true,
        name: true,
        path: true,
        content: true,
        isFolder: true,
        parentPath: true,
      });
      
      const parsed = createSchema.parse(req.body);
      
      // Check if file already exists
      const existing = await storage.getFileByPath(parsed.projectId, parsed.path);
      if (existing) {
        return res.status(409).json({ error: "File already exists" });
      }
      
      const file = await storage.createFile(parsed);
      res.status(201).json(file);
    } catch (error) {
      console.error("Error creating file:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create file" });
    }
  });

  app.patch("/api/files/:id", async (req, res) => {
    try {
      const updateSchema = insertFileSchema.partial().pick({
        content: true,
        name: true,
      });
      
      const parsed = updateSchema.parse(req.body);
      const file = await storage.updateFile(req.params.id, parsed);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      
      res.json(file);
    } catch (error) {
      console.error("Error updating file:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      await storage.deleteFile(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // GitHub API (simplified - token stored in memory for demo)
  let githubToken: string | null = null;

  app.get("/api/github/status", (req, res) => {
    res.json({ hasToken: !!githubToken });
  });

  app.post("/api/github/token", (req, res) => {
    try {
      const { token } = req.body;
      if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Token is required" });
      }
      githubToken = token;
      res.json({ success: true });
    } catch (error) {
      console.error("Error setting GitHub token:", error);
      res.status(500).json({ error: "Failed to set token" });
    }
  });

  app.get("/api/github/repos", async (req, res) => {
    try {
      if (!githubToken) {
        return res.status(401).json({ error: "GitHub token not set" });
      }

      const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=50", {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "ProDev-Studio",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          githubToken = null;
          return res.status(401).json({ error: "Invalid GitHub token" });
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();
      res.json(repos);
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      res.status(500).json({ error: "Failed to fetch repositories" });
    }
  });

  return httpServer;
}
