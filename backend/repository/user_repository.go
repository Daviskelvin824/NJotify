package repository

import "github.com/Daviskelvin824/TPA-Website/model"

type UserRepository interface {
	Save(user model.User)
	FindAll() []model.User
	FindByEmail(email string) (model.User, error)
	ActivateUserEmail(email string) error
	UpdateUser(user model.User) error
	GetUserToVerify() (UserVerificationInfo, error)
	FindByArtistId(artistId uint) model.User
}
