import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { CarsService } from "./cars.service";
import { Controller } from "@nestjs/common";
import { AddCarDto, CarFuelType, CarStatus, CarTransmission, UpdateCarDto } from '@carrent/shared';

@Controller()
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @MessagePattern("cars.get-cars-lest")
  async getCarsList(
    @Payload() data: { search: string; page: number; limit: number }
  ) {
    try {
      return await this.carsService.getCarsList(data.search, data.page, data.limit)
    } catch(error: any) {
      console.log("[Cars Microservice] getCarsList error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("cars.get-car-by-id")
  async getCarById({ id }: {id: string}) {
    try {
      return await this.carsService.getCarById(id)
    } catch (error: any) {
      console.log("[Cars Microservice] getCarById error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("cars.add-car")
  async addCar(@Payload() data: {dto: AddCarDto, ownerId: string}) {
    try {
      return await this.carsService.addCar(data.dto, data.ownerId);
    } catch (error: any) {
      console.log("[Cars Microservice] addCar error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("car.update-car")
  async updateCar(@Payload() data: { dto:  UpdateCarDto}) {
    try {
      return await this.carsService.updateCar(data.dto)
    } catch (error: any) {
      console.log("[Cars Microservice] updateCar error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("cars.remove-car-by-id")
  async removeCarById({ id }: { id: string }) {
    try {
      return await this.carsService.removeCarById(id)
    } catch (error: any) {
      console.log("[Cars Microservice] removeCarById error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("cars.update-car-status")
  async updateCarStatus({ id, status }: { id: string, status: CarStatus }) {
    try {
      return await this.carsService.updateCarStatus(id, status)
    } catch (error: any) {
      console.log("[Cars Microservice] updateCarStatus error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    } 
  }

  @MessagePattern("cars.update-car-transmission")
  async updateCarTransmission({ id, transmission }: { id: string, transmission: CarTransmission }) {
    try {
      return this.carsService.updateCarTransmission(id, transmission)
    } catch(error: any) {
      console.log("[Cars Microservice] updateCarTransmission error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }

  @MessagePattern("cars.update-car-fuelType")
  async updateCarFuelType({id, fuelType}: { id: string, fuelType: CarFuelType }) {
    try {
      return this.carsService.updateCarFuelType(id, fuelType)
    } catch(error: any) {
      console.log("[Cars Microservice] updateCarFuelType error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }
}
