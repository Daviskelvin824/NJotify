package request

import "time"

type CreateUserRequest struct {
	Email            string    `validate:"required" json:"email"`
	Username         string    `validate:"required" json:"username"`
	Password         string    `validate:"required" json:"password"`
	Gender           string    `validate:"required" json:"gender"`
	DOB              time.Time `validate:"required" json:"dob"`
	Country          string    `validate:"required" json:"country"`
	ProfilePageImage *string   `json:"profilepageimage"`
	IsVerified       bool      `json:"isverified"`
	IsArtist         bool      `json:"isartist"`
	BannerImage      *string   `json:"bannerimage"`
	AboutMe          *string   `json:"aboutme"`
	ArtistNotification *string `json:"artistnotification"`
	FollowerNotification *string `json:"followernotification"`
}
