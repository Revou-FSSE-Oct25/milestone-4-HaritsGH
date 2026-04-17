import { Controller, Get, Body, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  getProfileInfo(@Request() req: any) {
    return this.usersService.getProfileInfo(req.user.username);
  }

  @Patch('/profile')
  update(@Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    return this.usersService.update(updateUserDto, req.user.username);
  }

}
