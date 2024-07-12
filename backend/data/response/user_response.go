package response

import "time"

type UserResponse struct {
	UserId           uint      `json:"userid"`
	Email            string    `json:"email"`
	Username         string    `json:"username"`
	Password         string    `json:"password"`
	Gender           string    `json:"gender"`
	DOB              time.Time `json:"dob"`
	Country          string    `json:"country"`
	ProfilePageImage *string   `json:"profilepageimage"`
	IsVerified       bool      `json:"isverified"`
	IsArtist         bool      `json:"isartist"`
	BannerImage      *string   `json:"bannerimage"`
	AboutMe          *string   `json:"aboutme"`
}
