// src/config/prisma.js
// Singleton del cliente Prisma

import { PrismaClient } from '@prisma/client';

// Crear una única instancia
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error']
}).$extends({
  query: {
    $allModels : {
      $allOperations: async ({operation, model, args, query}) =>{
        const before = Date.now();
        const result = await query(args);
        const after = Date.now();
        console.log('Operation', operation);
        console.log('Model', model);
        console.log('args', args);
        console.log('query', query);
        console.log('.................................');  
        return result;    
      }
    }
  }
});

export default prisma;
