import { prisma } from "../../src/database";


export async function execute() {
    await prisma.$transaction([
      prisma.$executeRaw`TRUNCATE TABLE recommendations`
    ]);
  }