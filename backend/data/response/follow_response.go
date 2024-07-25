package response

type FollowResponse struct {
	FollowingId uint `json:"followingid"`
	FollowerId  uint `json:"followerid"`
}