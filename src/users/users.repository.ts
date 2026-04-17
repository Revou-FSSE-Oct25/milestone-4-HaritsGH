import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}
 
  getProfileInfo(username: string) {
    return this.prisma.profile.findUnique({
      where: {
        username: username
      }
    });
  }

  update(username: string, updateUserDto: UpdateUserDto) {
    return this.prisma.profile.upsert({
      where: {
        username: username
      },
      create: {
        username: username,
        ...updateUserDto
      },
      update: updateUserDto
    });
  }
}