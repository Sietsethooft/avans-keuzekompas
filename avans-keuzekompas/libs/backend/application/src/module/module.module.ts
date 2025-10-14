import { Module } from '@nestjs/common';
import { ModuleService } from './module.service.js';
import { MongooseModuleRepository } from '@avans-keuzekompas/infrastructure';
import { ModuleRepository } from '@avans-keuzekompas/domain';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as ModuleModel, ModuleSchema } from '@avans-keuzekompas/infrastructure';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModuleModel.name, schema: ModuleSchema }]),
  ],
  providers: [
    ModuleService,
    {
      provide: ModuleRepository,
      useClass: MongooseModuleRepository,
    },
  ],
  exports: [ModuleService],
})
export class ModuleModule {}