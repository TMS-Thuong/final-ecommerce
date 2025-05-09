export interface IJwtTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtPayload {
  email: string;
  userId: number;
}
