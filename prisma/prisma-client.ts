import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// Создаёт функцию, которая возвращает новый PrismaClient.
// Расширяет глобальный объект globalThis типом prismaGlobal.
// Использует существующий клиент, если он уже есть, иначе создаёт новый.
// В разработке сохраняет клиент в globalThis, чтобы при перезагрузке сервера не создавать новый экземпляр и не открывать лишние соединения с базой.
// В production просто создаёт один экземпляр без глобальной привязки.
