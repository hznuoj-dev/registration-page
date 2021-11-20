import util from 'util';
import cluster from 'cluster';
import path from 'path';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

import { json } from 'express';
import getGitRepoInfo from 'git-repo-info';
import moment from 'moment';

import { ConfigService } from '@/config/config.service';
import { ClusterService } from '@/cluster/cluster.service';
import { AppModule } from '@/app/app.module';

import packageInfo from '@/package.json';

export const appGitRepoInfo = getGitRepoInfo();

String.prototype.format = function format(...args: unknown[]) {
  return util.format.call(undefined, this, ...args);
};

async function initSwaggerDocument(
  app: NestExpressApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle(packageInfo.name)
    .setDescription(packageInfo.description)
    .setVersion(packageInfo.version)
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup(
    path.join(configService.config.server.baseUrl, 'docs'),
    app,
    document,
  );
}

async function initialize(): Promise<
  [configService: ConfigService, app: NestExpressApplication]
> {
  const appVersion = `v${packageInfo.version}`;
  const gitRepoVersion = appGitRepoInfo.abbreviatedSha
    ? ` (Git revision ${appGitRepoInfo.abbreviatedSha} on ${moment(
        appGitRepoInfo.committerDate,
      ).format('YYYY-MM-DD HH:mm:ss')})`
    : '';

  if (cluster.isPrimary)
    Logger.log(
      `Starting ${packageInfo.name} version ${appVersion}${gitRepoVersion}`,
      'Bootstrap',
    );

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    ...(process.env.NODE_ENV === 'production'
      ? { logger: ['warn', 'error'] }
      : {}),
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.config.server.baseUrl);
  app.use(json({ limit: '1024mb' }));

  app.set('trust proxy', configService.config.server.trustProxy);

  initSwaggerDocument(app, configService);

  return [configService, app];
}

async function startApp(
  configService: ConfigService,
  app: NestExpressApplication,
) {
  await app.listen(
    configService.config.server.port,
    configService.config.server.hostname,
  );

  Logger.log(
    `${packageInfo.name} is listening on ${configService.config.server.hostname}:${configService.config.server.port}`,
    'Bootstrap',
  );
}

async function bootstrap() {
  const [configService, app] = await initialize();

  const clusterService = app.get(ClusterService);
  await clusterService.initialization(
    async () => await startApp(configService, app),
  );
}

bootstrap().catch((err) => {
  console.error(err);
  console.error('Error bootstrapping the application, exiting...');
  process.exit(1);
});
