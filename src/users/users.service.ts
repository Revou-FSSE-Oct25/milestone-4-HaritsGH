import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  getProfileInfo(username: string) {
    return this.usersRepository.getProfileInfo(username);
  }
  update(updateUserDto: UpdateUserDto, username: string) {
    return this.usersRepository.update(updateUserDto, username);
  }
}
