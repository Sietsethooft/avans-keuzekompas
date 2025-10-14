import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ModuleService } from '@avans-keuzekompas/application';
import { jsonResponse } from '@avans-keuzekompas/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllModules() {
    Logger.log('Get all modules attempt');
    try {
      const modules = await this.moduleService.getAllModules();
      Logger.log('Get all modules successful');
      return jsonResponse(200, 'Modules retrieved successfully', modules);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve modules';
      Logger.log('Get all modules failed:', errorMessage);
      return jsonResponse(500, errorMessage, null);
    }
  }
}