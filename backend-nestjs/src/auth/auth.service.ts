import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      name: registerDto.name,
      passwordHash: hashedPassword,
    });
    
    // Create JWT payload and return token
    const payload = { email: user.email, sub: user.id };
    const { passwordHash, ...result } = user;
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Old password does not match');

    user.passwordHash = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.save(user);
    return { message: 'Password updated successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) throw new NotFoundException('If email exists, a reset link will be sent.');

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    
    // Token valid for 1 hour
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    user.resetTokenExpiry = expiry;

    await this.usersService.save(user);

    // In a real app, send an email here instead of returning it!
    // For educational purposes, we return it to make testing easier without email service setup.
    return { 
      message: 'Password reset token generated.',
      mock_token_for_testing: token 
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Find user by token (In production, would usually need to do a DB query to find the user with this token)
    // To simplify for this educational project, assuming token is sent and we check all users or send email with token + email.
    // Let's modify approach: We'll need the user email to find the user reliably if we don't have a special query for tokens alone.
    // However, if we're simulating, we'll implement a workaround or ask student to build the "find by token" query.
    throw new Error("resetPassword needs user email or token query");
  }
}
