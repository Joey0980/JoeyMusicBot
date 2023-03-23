import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class DB extends PrismaClient {
    constructor() {
        super();
    }
}

export { prisma };