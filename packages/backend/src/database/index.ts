import {PrismaClient} from '@prisma/client';

const db = new PrismaClient();

export default  db;

/* Since this code uses ES6 Modules, the database connection client (db) will be created only once, no matter how many files imports this */