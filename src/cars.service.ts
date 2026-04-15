import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { internalErrorHandler } from "./utils";
import { AddCarDto, Car, CarFuelType, CarStatus, CarTransmission, PaginatedCarsResponse } from "@carrent/shared";

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async getCarsList(
    search: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedCarsResponse> {
    try {
      const skip = (page - 1) * limit;
      const [cars, total] = await this.prisma.$transaction([
        this.prisma.car.findMany({
          skip,
          take: limit,
          orderBy: { brand: 'asc' },
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            description: true,
            status: true,
            pricePerDay: true,
            transmission: true,
            ownerId: true,
            fuelType: true,
            color: true,
            location: true,
            createdAt: true,
            updatedAt: true,
          },
          where: {
            OR: [
              { brand: { contains: search, mode: 'insensitive' } },
              { model: { contains: search, mode: 'insensitive' } },
              { color: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
            ]
          }
        }),
        this.prisma.car.count({
          where: {
            OR: [
              { brand: { contains: search, mode: 'insensitive' } },
              { model: { contains: search, mode: 'insensitive' } },
              { color: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
            ],
          },
        }),
      ])

      return {
        data: cars.map(car => ({
          ...car,
          status: car.status as CarStatus,
          transmission: car.transmission as CarTransmission,
          fuelType: car.fuelType as CarFuelType,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    } catch(error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during getting cars:", error);
      throw internalErrorHandler(500, "Getting cars failed");
    }
  }

  async getCarById(id: string): Promise<Car> {
    try {
      const car = await this.prisma.car.findUnique({
        where: { id },
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          description: true,
          status: true,
          pricePerDay: true,
          transmission: true,
          ownerId: true,
          fuelType: true,
          color: true,
          location: true,
          createdAt: true,
          updatedAt: true,
        }
      })

      if (!car) {
        throw internalErrorHandler(404, "Car is not found by id")
      }

      return {
        ...car,
        status: car.status as CarStatus,
        transmission: car.transmission as CarTransmission,
        fuelType: car.fuelType as CarFuelType,
      }

    } catch(error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Unexpected error during getting car by id:", error);
      throw internalErrorHandler(500, "Getting car by id failed");
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

  async removeCarById(id: string): Promise<string> {
    try {
      await this.prisma.car.delete({ where: { id } })
      return id
    } catch(error) {
      console.error("Prisma error details:", error);
      if (error.code === 'P2025') {
        throw internalErrorHandler(404, `Car: ${id} is not found`);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error during removing car by id:", error);
      throw internalErrorHandler(500, "Remiving car by id failed");
    }
  }
}
