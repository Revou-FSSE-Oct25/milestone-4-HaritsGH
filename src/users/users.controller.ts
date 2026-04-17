import { Controller, Get, Body, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @ApiOperation({ summary: 'Get profile info' })
  @ApiResponse({ status: 200, description: 'Profile info retrieved successfully' })
  getProfileInfo(@Request() req: any) {
    return this.usersService.getProfileInfo(req.user.username);
  }

  @Patch('/profile')
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  update(@Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    return this.usersService.update(updateUserDto, req.user.username);
  }

}
