import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { isEmpty } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { CreateUserDto } from '@dtos/users.dto';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import userService from '@services/users.service';

class AuthService {
  private userService = new userService();

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not complete');

    const createdUser = await this.userService.createUser(userData);
    return createdUser;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; tokenData: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not complete');

    const user: User = await userModel.findOne({ email: userData.email });
    if (!user) throw new HttpException(409, `Email '${userData.email}' not found`);

    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    if (!tokenData) throw new HttpException(500, 'Cannot log in');
    return { cookie, tokenData };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not complete');

    const user: User = await userModel.findOne({ email: userData.email, password: userData.password });
    if (!user) throw new HttpException(409, `Email '${userData.email}' not found`);

    return user;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
