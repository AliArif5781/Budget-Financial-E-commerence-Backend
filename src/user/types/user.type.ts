export enum Role {
  Admin = 'Admin',
  User = 'User',
}

export type userProfileDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

// export type updateUserDto = {
//   phone?: string;
//   city?: string;
//   zip?: string;
//   address?: string;
// };
