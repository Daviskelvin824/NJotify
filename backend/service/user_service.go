package service

import (
	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
)

type UserService interface {
	Create(users request.CreateUserRequest)
	FindAll() []response.UserResponse
	FindByEmail(email string) (response.UserResponse, error)
	ActivateUserEmail(email string) error
	EditProfileUser(user *response.UserResponse) error
	UpdateUser(user *response.UserResponse) error
	GetUserToVerify() (response.UserVerificationResponse, error)
	GetUserByArtistId(artistId uint) response.UserResponse
	GetFFM(userId uint) response.FFMResponse
}
