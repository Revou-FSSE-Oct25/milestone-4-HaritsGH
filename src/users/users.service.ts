import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  getProfileInfo(username: string) {
    return this.usersRepository.getProfileInfo(username);
  }
  update(updateUserDto: UpdateUserDto) {
    const uname = 'harhar'
    return this.usersRepository.update(uname, updateUserDto);
  }
}
