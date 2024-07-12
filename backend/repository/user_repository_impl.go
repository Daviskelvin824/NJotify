package repository

import (
	"errors"

	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/model"
	"gorm.io/gorm"
)

type UserRepositoryImpl struct {
	Db *gorm.DB
}

type UserVerificationInfo struct {
	Users          []model.User
	FollowingCount []int
	FollowerCount  []int
}

func NewUserRepositoryImpl(Db *gorm.DB) UserRepository {
	return &UserRepositoryImpl{Db: Db}
}

func (c *UserRepositoryImpl) Save(user model.User) {
	result := c.Db.Create(&user)
	helper.CheckPanic(result.Error)
}

func (c *UserRepositoryImpl) FindAll() []model.User {
	var users []model.User
	result := c.Db.Find(&users)
	helper.CheckPanic(result.Error)
	return users
}

func (repo *UserRepositoryImpl) FindByEmail(email string) (model.User, error) {
	var user model.User
	result := repo.Db.Where("email = ?", email).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return model.User{}, gorm.ErrRecordNotFound // Return the error directly
	}
	if result.Error != nil {
		return model.User{}, result.Error // Return other errors as usual
	}
	return user, nil
}

func (repo *UserRepositoryImpl) ActivateUserEmail(email string) error {
	var user model.User
	result := repo.Db.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return result.Error
	}

	user.IsVerified = true
	if err := repo.Db.Save(&user).Error; err != nil {
		return err
	}

	return nil
}

func (repo *UserRepositoryImpl) UpdateUser(user model.User) error {
	if err := repo.Db.Save(&user).Error; err != nil {
		return err
	}
	return nil
}

func (repo *UserRepositoryImpl) GetUserToVerify() (UserVerificationInfo, error) {
	var users []model.User
	result := repo.Db.Where("banner_image IS NOT NULL AND is_artist = ?", false).Find(&users)
	helper.CheckPanic(result.Error)

	var followingCounts []int
	var followerCounts []int

	for _, user := range users {
		var followingCount int64
		var followerCount int64

		repo.Db.Model(&model.Follow{}).Where("following_id = ?", user.UserId).Count(&followingCount)
		repo.Db.Model(&model.Follow{}).Where("follower_id = ?", user.UserId).Count(&followerCount)

		followingCounts = append(followingCounts, int(followingCount))
		followerCounts = append(followerCounts, int(followerCount))

	}

	return UserVerificationInfo{
		Users:          users,
		FollowingCount: followingCounts,
		FollowerCount:  followerCounts,
	}, nil
}

func (repo *UserRepositoryImpl) FindByArtistId(artistId uint) model.User {
	var users model.User
	result := repo.Db.Where("user_id = ?", artistId).Find(&users)
	helper.CheckPanic(result.Error)
	return users
}
