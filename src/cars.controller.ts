import { MessagePattern, RpcException } from "@nestjs/microservices";
import { CarsService } from "./cars.service";
import { Controller } from "@nestjs/common";

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
}
