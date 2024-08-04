package repository

import (
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/model"
)

type UserRepository interface {
	Save(user model.User)
	FindAll() []model.User
	FindAllArtist() []model.User
	FindByEmail(email string) (model.User, error)
	FindByUsername(username string) (model.User, error)
	ActivateUserEmail(email string) error
	UpdateUser(user model.User) error
	GetUserToVerify() (UserVerificationInfo, error)
	FindByArtistId(artistId uint) model.User
	GetFFM(userId uint) response.FFMResponse
	FollowPerson(follow model.Follow)
	UnFollowPerson(follow model.Follow)
	ValidateFollowing(follow model.Follow) bool
	GetFollowingPaginated(userId int, pageId int) []model.User
	GetFollowerPaginated(userId int, pageId int) []model.User
	AddToSearchHistory(model.SearchHistory)
	GetSearchHistory(userId int)[]model.SearchHistory
}
