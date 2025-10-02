import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOrCreate(email: string): Promise<User> {
    let user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      user = new this.userModel({ email, saldoK: 0 });
      await user.save();
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateSaldo(email: string, amount: number): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { email },
      { $inc: { saldoK: amount } },
      { new: true },
    ).exec();
  }
}
