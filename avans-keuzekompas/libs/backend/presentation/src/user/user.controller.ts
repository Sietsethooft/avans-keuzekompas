import { Controller, Get, Logger, Param } from '@nestjs/common';
import { UserService } from '@avans-keuzekompas/application';
import { jsonResponse } from '@avans-keuzekompas/utils';

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
}