import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async sayHi(): Promise<string> {
    try {
      return Promise.resolve("Hello, i am CARS microservice");
    } catch (error) {
      throw new Error("Some error has occured");
    }
  }
}
