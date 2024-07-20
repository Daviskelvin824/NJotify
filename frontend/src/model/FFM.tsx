import { User } from "./User";

export interface FFM {
  followinguser: User[];
  followeruser: User[];
  mutualfollowinguser: User[];
}
