import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/';

// To simulate call to external API
const usersDB = [
  {
    id: '1',
    name: 'JaRomero',
    email: 'julioromero@policia.chubut.gov.ar',
    password: '1234',
    roles: ['admin', 'user'],
  },
];

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.roles) {
      user.roles = updateUserDto.roles;
    }

    this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return this.userRepository.remove(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = usersDB.find(
      (user) => user.email === email && user.password === password,
    );

    if (!user) throw new UnauthorizedException('Invalid credentials');

    let localUser = await this.userRepository.findOneBy({ email });

    if (!localUser) {
      const newUser = this.userRepository.create({
        name: user.name,
        email: user.email,
        roles: user.roles,
      });

      localUser = await this.userRepository.save(newUser);
    } else {
      delete user.id;
      localUser = await this.updateUser(localUser.id, user);
    }

    return {
      user: localUser,
      token: this.getJwtToken({ id: localUser.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
