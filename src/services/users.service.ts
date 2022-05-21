import { isValidObjectId } from 'mongoose';
import { hash } from 'bcrypt';
import { HttpException } from '@exceptions/HttpException';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import userModel from '@models/users.model';

class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await userModel.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'User id not provided');
    if (!isValidObjectId(userId)) throw new HttpException(404, `User '${userId}' not found`);

    const user: User = await userModel.findOne({ _id: userId });
    return user;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not complete');

    const user: User = await userModel.findOne({ email: userData.email });
    if (user) throw new HttpException(409, `Email '${userData.email}' already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createdUser: User = await userModel.create({ ...userData, password: hashedPassword });
    if (!createdUser) throw new HttpException(500, 'Cannot create user');

    return createdUser;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not complete');
    if (!isValidObjectId(userId)) throw new HttpException(409, `User '${userId}' not found`);

    if (userData.email) {
      const user: User = await userModel.findOne({ email: userData.email });
      if (user && user._id != userId) throw new HttpException(409, `Email '${userData.email}' already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updatedUser: User = await userModel.findByIdAndUpdate(userId, { userData });
    if (!updatedUser) throw new HttpException(409, 'Cannot update user');

    return updatedUser;
  }

  public async deleteUser(userId: string): Promise<User> {
    if (!isValidObjectId(userId)) throw new HttpException(409, `User '${userId}' not found`);

    const deletedUser: User = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) throw new HttpException(409, 'Cannot delete user');

    return deletedUser;
  }
}

export default UserService;
