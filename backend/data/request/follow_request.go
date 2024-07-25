package request

type FollowRequest struct {
	FollowingId uint `validate:"required" json:"followingid"`
	FollowerId  uint `validate:"required" json:"followerid"`
}