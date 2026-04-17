import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async checkUser(email: string, username: string): Promise<string | boolean> {
        if (email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email }
            });
            if (existingEmail) return 'Email already exists';
        }
        
        if (username) {
            const existingUsername = await this.prisma.user.findUnique({
                where: { username }
            });
            if (existingUsername) return 'Username already exists';
        }
        
        return false;
    }

    async register(registerDto: any) {
        // TODO: Implement user registration logic
        return true;
    }
}
