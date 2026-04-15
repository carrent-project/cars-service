import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { CarsService } from "./cars.service";
import { Controller } from "@nestjs/common";
import { AddCarDto } from '@carrent/shared';

@Controller()
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @MessagePattern("cars.hello")
  async sayHi() {
    try {
      return await this.carsService.sayHi();
    } catch (error) {
      console.log("[Cars Microservice] sayHi error:", error);
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
}
