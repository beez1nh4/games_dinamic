import { faker } from "@faker-js/faker";
import app from "app";
import prisma from "config/database";
import supertest from "supertest";
import { createConsole, createGames } from "../factories";

beforeEach(async() => {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})

const server = supertest(app);

describe("GET /games", () => {
    it("should respond with status 200 and array of game data if games exist", async () => {
      const console = await createConsole()
      const game = await createGames(console.id);
      const response = await server.get("/games");
      expect(response.body).toEqual([{
        id: game.id,
        title: game.title,
        consoleId: game.consoleId,
        Console: {
            id: console.id,
            name: console.name
        }
      }]);
      expect(response.status).toBe(200);
    });
  
    it("should respond with status 200 and empty array if games dont exist", async () => {
      const response = await server.get("/games");
      expect(response.body).toEqual([])
      expect(response.status).toBe(200);
    });
})

describe("GET /games/:id", () => {
    it("should respond with status 200 and game data if id exists", async () => {
      const console = await createConsole();
      const game = await createGames(console.id)
      const response = await server.get(`/games/${game.id}`);
      expect(response.body).toEqual({
        id: game.id,
        title: game.title,
        consoleId: game.consoleId
      });
      expect(response.status).toBe(200);
    });
  
    it("should respond with status 404 if id doesnt exist", async () => {
      const response = await server.get("/games/6");
      expect(response.status).toBe(404);
    });
})

describe("POST /games", () => {
  it("should respond with status 201 if body is correct", async () => {
    const console = await createConsole()
    const gamesBody = {
      title: faker.name.firstName(),
      consoleId: console.id
    };
    const response = await server.post("/games").send(gamesBody);
    expect(response.status).toBe(201);
  });

  it("should respond with status 409 if game already exists", async () => {
    const console = await createConsole();
    const game = await createGames(console.id);
    const gameBody = {
      title: game.title,
      consoleId: console.id
    }
    const response = await server.post("/games").send(gameBody);
    expect(response.status).toBe(409);
  });

  it("should respond with status 409 if console doesnt exists", async () => {
    const gamesBody = {
      title: faker.name.firstName(),
      consoleId: 0
    }
    const response = await server.post("/games").send(gamesBody);
    expect(response.status).toBe(409);
  });
})
