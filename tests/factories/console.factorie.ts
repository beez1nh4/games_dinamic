import {faker} from "@faker-js/faker";
import prisma from "config/database";

export async function createConsole() {
    return prisma.console.create({
   data: {
    name: faker.name.firstName()
   }
    })
}
