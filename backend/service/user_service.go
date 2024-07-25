package service

import (
	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
)

type UserService interface {
	Create(users request.CreateUserRequest)
	FindAll() []response.UserResponse
	FindAllArtist() []response.UserResponse
	FindByEmail(email string) (response.UserResponse, error)
	FindByUsername(username string) (response.UserResponse, error)
	ActivateUserEmail(email string) error
	EditProfileUser(user *response.UserResponse) error
	UpdateUser(user *response.UserResponse) error
	GetUserToVerify() (response.UserVerificationResponse, error)
	GetUserByArtistId(artistId uint) response.UserResponse
	GetFFM(userId uint) response.FFMResponse
	FollowPerson(req request.FollowRequest) 
	UnFollowPerson(req request.FollowRequest)
	ValidateFollowing(req request.FollowRequest) bool
	GetFollowingPaginated(userId int, pageId int) []response.UserResponse
	GetFollowerPaginated(userId int, pageId int) []response.UserResponse
}
