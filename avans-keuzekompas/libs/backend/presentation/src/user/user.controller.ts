import { Controller, Get, Logger, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from '@avans-keuzekompas/application';
import { jsonResponse } from '@avans-keuzekompas/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get(':id')
    async getUser(@Param('id') id: string) {
      Logger.log('Get user attempt:', id);
      try {
        const user = await this.userService.getUserById(id);
        Logger.log('Get user successful for:', user);
        return jsonResponse(200, 'User retrieved successfully', user);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve user';
        Logger.log('Get user failed:', errorMessage);
        return jsonResponse(500, errorMessage, null);
      }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
      Logger.log('Delete user attempt:', id);
      try {
        await this.userService.deleteUserById(id);
        Logger.log('Delete user successful for:', id);
        return jsonResponse(200, 'User deleted successfully', null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
        Logger.log('Delete user failed:', errorMessage);
        return jsonResponse(500, errorMessage, null);
      }
    }
}