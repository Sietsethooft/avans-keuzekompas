import { Controller, Get, Put, Logger, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { ModuleService } from '@avans-keuzekompas/application';
import { jsonResponse } from '@avans-keuzekompas/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { OwnerOrAdminGuard } from '../auth/owner-or-admin.guard.js';

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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getModuleById(@Param('id') id: string) {
    Logger.log('Get module by ID attempt');
    try {
      const module = await this.moduleService.getModuleById(id);
      if (!module) {
        Logger.log('Get module by ID failed: Module not found');
        return jsonResponse(404, 'Module not found', null);
      }
      Logger.log('Get module by ID successful');
      return jsonResponse(200, 'Module retrieved successfully', module);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve module';
      Logger.log('Get module by ID failed:', errorMessage);
      return jsonResponse(500, errorMessage, null);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('favorite/:id')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async toggleFavoriteModule(@Param('id') moduleId: string, @Req() req: any) {
    Logger.log('Toggle favorite module attempt');
    try {
      const userId = req?.user?.sub ?? req?.user?.id ?? req?.user?._id ?? req?.user?.userId;
      if (!userId) {
        Logger.warn('Toggle favorite module failed: Missing user in token');
        return jsonResponse(401, 'Unauthorized', null);
      }

      const result = await this.moduleService.toggleFavoriteForUser(moduleId, userId);

      Logger.log('Toggle favorite module successful');
      return jsonResponse(200, 'Favorite status toggled successfully', result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle favorite status';
      Logger.log('Toggle favorite module failed:', errorMessage);
      return jsonResponse(500, errorMessage, null);
    }
  }

  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @Delete(':id')
  async deleteModuleById(@Param('id') id: string) {
    Logger.log('Delete module by ID attempt');
    try {
      await this.moduleService.deleteModuleById(id);
      Logger.log('Delete module by ID successful');
      return jsonResponse(200, 'Module deleted successfully', null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete module';
      Logger.log('Delete module by ID failed:', errorMessage);
      return jsonResponse(500, errorMessage, null);
    }
  }

  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @Put(':id')
  async updateModuleById(@Param('id') id: string) {
    Logger.log('Update module by ID attempt: ' + id);
    try {
      // eslint-disable-next-line prefer-rest-params
      const update = (arguments.length > 1 && typeof arguments[1] === 'object') ? arguments[1] : undefined;
      const updatedModule = await this.moduleService.updateModuleById(id, update);
      Logger.log('Update module successful for: ' + id);
      return jsonResponse(200, 'Module updated successfully', updatedModule);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update module';
      Logger.log('Update module failed: ' + errorMessage);
      return jsonResponse(500, errorMessage, null);
    }
  }
}