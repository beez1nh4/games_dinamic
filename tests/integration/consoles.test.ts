import { faker } from "@faker-js/faker";
import app from "app";
import prisma from "config/database";
import supertest from "supertest";
import { createConsole } from "../factories";

beforeEach(async() => {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})

const server = supertest(app);

describe("GET /consoles", () => {
    it("should respond with status 200 and array of console data if consoles exist", async () => {
      const console = await createConsole();
      const response = await server.get("/consoles");
      expect(response.body).toEqual([{
        id: console.id,
        name: console.name
      }]);
      expect(response.status).toBe(200);
    });
  
    it("should respond with status 200 and empty array if consoles dont exist", async () => {
      const response = await server.get("/consoles");
      expect(response.body).toEqual([])
      expect(response.status).toBe(200);
    });
})

describe("GET /consoles/:id", () => {
    it("should respond with status 200 and console data if id exists", async () => {
      const console = await createConsole();
      const response = await server.get(`/consoles/${console.id}`);
      expect(response.body).toEqual({
        id: console.id,
        name: console.name
      });
      expect(response.status).toBe(200);
    });
  
    it("should respond with status 404 if id doesnt exist", async () => {
      const response = await server.get("/consoles/6");
      expect(response.status).toBe(404);
    });
})

describe("POST /consoles", () => {
  it("should respond with status 201 if body is correct", async () => {
    const consoleBody = {
      name: faker.name.firstName()
    };
    const response = await server.post("/consoles").send(consoleBody);
    expect(response.status).toBe(201);
  });

  it("should respond with status 409 if console already exists", async () => {
    const console = await createConsole();
    const consoleBody = {
      name: console.name
    }
    const response = await server.post("/consoles").send(consoleBody);
    expect(response.status).toBe(409);
  });
})
