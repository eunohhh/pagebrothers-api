import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: any;
}

export interface StateType {
  protocol: string;
  host: string;
  redirect_uri?: string;
  register_uri?: string;
}
