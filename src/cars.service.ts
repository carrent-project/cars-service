import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { internalErrorHandler } from './utils';
import { AddCarDto } from '@carrent/shared';

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

async addCar(dto: AddCarDto, ownerId: string): Promise<string> {
    try {
      const data = { ...dto, ownerId };
      const newCar = await this.prisma.car.create({ data });
      return newCar.id;
    } catch (error) {
      console.error("Prisma error details:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during adding car:", error);
      throw internalErrorHandler(500, "Adding car failed");
    }
}
}
