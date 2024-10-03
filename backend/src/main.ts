import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8082;

  // Enable CORS with specific origins
  app.enableCors({
    origin: 'http://localhost:3000', // Adjust this to match your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port, () => console.log(`Server running on port ${port}`));
}
bootstrap();
