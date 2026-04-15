import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { CarsService } from "./cars.service";
import { Controller } from "@nestjs/common";
import { AddCarDto } from '@carrent/shared';

@Controller()
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @MessagePattern("cars.get-cars-lest")
  async getCarsList(
    @Payload() data: { search: string; page: number; limit: number }
  ) {
    try {
      return await this.carsService.getCarsList(data.search, data.page, data.limit)
    } catch(error) {
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
    } catch (error) {
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
    } catch (error) {
      console.log("[Cars Microservice] addCar error:", error);
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
    } catch (error) {
      console.log("[Cars Microservice] getCarById error:", error);
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || "Internal server error",
      });
    }
  }
}
