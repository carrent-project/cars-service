import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CarsModule } from './app.module';

async function cars() {
  const PORT = process.env.PORT;
  const port = PORT ? +PORT : 5003;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CarsModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port,
      },
    },
  );

  await app.listen();
  console.log(`🚀 cars microservice is listening on port ${port}`);
}
cars();
