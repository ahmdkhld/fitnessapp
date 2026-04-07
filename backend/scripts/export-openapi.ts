/**
 * Exports the generated Swagger/OpenAPI document to ./openapi.json.
 * Run with: `npm run openapi:export`
 *
 * Mobile and web clients can consume this file with openapi-typescript
 * or openapi-generator to replace hand-written clients.
 */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NutriTrack API')
    .setDescription('Diet & supplement tracking API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const outPath = path.resolve(__dirname, '..', 'openapi.json');
  fs.writeFileSync(outPath, JSON.stringify(document, null, 2));
  // eslint-disable-next-line no-console
  console.log(`Wrote ${outPath}`);

  await app.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
