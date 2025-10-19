/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Logger, Param, Delete, UseGuards, Put, Body, Req } from '@nestjs/common';
import { UserService } from '@avans-keuzekompas/application';
import { jsonResponse } from '@avans-keuzekompas/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { OwnerOrAdminGuard } from '../auth/owner-or-admin.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: any) {
      const userId = req?.user?.sub ?? req?.user?.id ?? req?.user?._id ?? req?.user?.userId;
      Logger.log('Get profile attempt: ' + userId);
      try {
        const profile = await this.userService.getUserById(userId);
        Logger.log('Get profile successful for: ' + userId);
        return jsonResponse(200, 'Profile retrieved successfully', profile);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve profile';
        Logger.log('Get profile failed: ' + errorMessage);
        return jsonResponse(500, errorMessage, null);
      }
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
      Logger.log('Get user attempt: ' + id);
      try {
        const user = await this.userService.getUserById(id);
        Logger.log('Get user successful for:', id);
        return jsonResponse(200, 'User retrieved successfully', user);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve user';
        Logger.log('Get user failed:', errorMessage);
        return jsonResponse(500, errorMessage, null);
      }
    }

    @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
      Logger.log('Delete user attempt: ' + id);
      try {
        await this.userService.deleteUserById(id);
        Logger.log('Delete user successful for: ' + id);
        return jsonResponse(200, 'User deleted successfully', null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
        Logger.log('Delete user failed: ' + errorMessage);
        return jsonResponse(500, errorMessage, null);
      }
    }

    @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() update: Partial<{ firstName: string; lastName: string; email: string; studentNumber: string; favorites: string[] }>) {
      Logger.log('Update user attempt: ' + id);
      try {
        const updatedUser = await this.userService.updateUserById(id, update);
        Logger.log('Update user successful for: ' + id);
        return jsonResponse(200, 'User updated successfully', updatedUser);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
        Logger.log('Update user failed: ' + errorMessage);
        return jsonResponse(500, errorMessage, null);
      }
    }    
}