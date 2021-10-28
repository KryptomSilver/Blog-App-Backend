import { Request } from "express";
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
export interface IBlog extends Document {
  user: string;
  title: string;
  content: string;
  description: string;
  thumbnail: string;
  category: string;
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
export interface IGgPayload {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
}
export interface IUserParams {
  name: string;
  account: string;
  password: string;
  avatar?: string;
  type: string;
}
export interface IReqAuth extends Request {
  user?: IUser;
}
