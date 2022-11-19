export interface JwtPayloadDto {
  username: string;
  fullName: string;
  userType: string;
  userId: string;
  email: string;
  refreshToken?: boolean;
}
