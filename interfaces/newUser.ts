import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  account: string;
  password: string;
  avatar: string;
  role: string;
  type: string;
  _doc: object;
}
export interface newUser {
  name: string;
  account: string;
  password: string;
}
export interface IDecodeToken {
  id?: string;
  newUser?: newUser;
  iat: number;
  exp: number;
}
