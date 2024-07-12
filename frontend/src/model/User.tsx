export interface User {
  userid?: number;
  email: string;
  username: string;
  password: string;
  gender: string;
  dob: Date;
  country: string;
  profilepageimage?: string;
  isverified: boolean;
  isartist: boolean;
  bannerimage?: string;
  aboutme?: string;
}
