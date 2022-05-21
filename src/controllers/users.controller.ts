import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { transformUser, transformUsers } from '@/utils/transform';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users: User[] = await this.userService.findAllUser();

      res.status(200).json({ status: 200, data: transformUsers(users), message: 'Get Users Succeed' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const user: User = await this.userService.findUserById(userId);

      if (!user) {
        return res.status(404).json({ status: 404, message: `User '${userId}' not found` });
      }

      res.status(200).json({ status: 200, data: transformUser(user), message: 'Get User Succeed' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const user: User = await this.userService.createUser(userData);

      res.status(201).json({ status: 201, data: transformUser(user), message: 'Create User Succeed' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: CreateUserDto = req.body;
      const user: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ status: 200, data: transformUser(user), message: 'Update User Succeed' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const user: User = await this.userService.deleteUser(userId);

      res.status(200).json({ status: 200, data: transformUser(user), message: 'Delete User Succeed' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
