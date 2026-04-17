import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkUserExists(email: string, username: string) {
    const emailRes = await this.prisma.user.findFirst({
      where: {
        email
      }
    })
    if (emailRes) {
      return 'Email';
    }
    const usernameRes = await this.prisma.user.findFirst({
      where: {
        username
      }
    })
    if (usernameRes) {
      return 'Username';
    }
    return null;
  }

  async findOne(username: string) {
    if (!username) {
      return null;
    }
    return this.prisma.user.findUnique({
      where: {
        username
      }
    })
  }

  async register(registerDto: RegisterDto) {
    return this.prisma.user.create({
      data: registerDto
    })
  }
}
