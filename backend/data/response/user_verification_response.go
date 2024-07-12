package response

import "github.com/Daviskelvin824/TPA-Website/model"

type UserVerificationResponse struct {
	Users          []model.User `json:"userarray"`
	FollowingCount []int        `json:"followingcount"`
	FollowerCount  []int        `json:"followercount"`
}
