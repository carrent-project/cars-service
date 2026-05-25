import { Module } from "@nestjs/common";
import { CarsController } from "./cars.controller";
import { CarsService } from "./cars.service";
import { PrismaService } from "./prisma.service";
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REVIEWS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 5005,
        },
      },
    ]),
  ],
  controllers: [CarsController],
  providers: [CarsService, PrismaService],
})
export class CarsModule {}
