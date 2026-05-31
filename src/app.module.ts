import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { AuthAppleModule } from './auth-apple/auth-apple.module';
import appleConfig from './auth-apple/config/apple.config';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import facebookConfig from './auth-facebook/config/facebook.config';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import googleConfig from './auth-google/config/google.config';
import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
import { AffectedAreasModule } from './affected-areas/affected-areas.module';
import { CollectionPointsModule } from './collection-points/collection-points.module';
import { AllConfigType } from './config/config.type';
import appConfig from './config/app.config';
import databaseConfig from './database/config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { EvidenceModule } from './evidence/evidence.module';
import { ExternalObservationsModule } from './external-observations/external-observations.module';
import { ExternalReferencesModule } from './external-references/external-references.module';
import { FilesModule } from './files/files.module';
import fileConfig from './files/config/file.config';
import { MailModule } from './mail/mail.module';
import mailConfig from './mail/config/mail.config';
import { MailerModule } from './mailer/mailer.module';
import { MissionsModule } from './missions/missions.module';
import { MissionSchedulesModule } from './mission-schedules/mission-schedules.module';
import { MobileModule } from './mobile/mobile.module';
import { PowersyncModule } from './powersync/powersync.module';
import { PropertiesModule } from './properties/properties.module';
import { PropertyUsersModule } from './property-users/property-users.module';
import { RestorationPlanVersionsModule } from './restoration-plan-versions/restoration-plan-versions.module';
import { RestorationPlansModule } from './restoration-plans/restoration-plans.module';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

import { CompliancesModule } from './compliances/compliances.module';

@Module({
  imports: [
    MissionSchedulesModule,
    CollectionPointsModule,
    AffectedAreasModule,
    RestorationPlanVersionsModule,
    RestorationPlansModule,
    ExternalObservationsModule,
    ExternalReferencesModule,
    PropertyUsersModule,
    PropertiesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthAppleModule,
    SessionModule,
    MailModule,
    MailerModule,
    MissionsModule,
    EvidenceModule,
    PowersyncModule,
    MobileModule,
    CompliancesModule,
  ],
})
export class AppModule {}
