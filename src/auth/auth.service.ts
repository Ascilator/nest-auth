import { User } from './../users/users.model';
import { CreateUserDto } from './../users/dto/create-user-dto';
import { UsersService } from './../users/users.service';
import {
  Injectable,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('already created', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async validateUser(dto: CreateUserDto) {
    const user =
      (await this.userService.getUserByEmail(dto.email)) || ({} as User);
    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException('wrong password');
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
