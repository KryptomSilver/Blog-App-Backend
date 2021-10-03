export interface newUser {
  name: string;
  account: string;
  password: string;
}
export interface IDecodeToken {
  newUser: newUser;
  iat: number;
  exp: number;
}
