import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class ListUsersService {
  async execute() {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find();

    return users;
  }
}
