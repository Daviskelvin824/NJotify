package response

type FFMResponse struct {
	FollowingUser       []UserResponse `json:"followinguser"`
	FollowerUser        []UserResponse `json:"followeruser"`
	MutualFollowingUser []UserResponse `json:"mutualfollowinguser"`
}