package service

import (
	"errors"

	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/model"
	"github.com/Daviskelvin824/TPA-Website/repository"
	"github.com/go-playground/validator"
	"gorm.io/gorm"
)

type UserServiceImpl struct {
	UserRepository repository.UserRepository
	Validate       *validator.Validate
}

func NewUserServiceImpl(userRepository repository.UserRepository, validate *validator.Validate) UserService {
	return &UserServiceImpl{
		UserRepository: userRepository,
		Validate:       validate,
	}
}

func (c *UserServiceImpl) Create(users request.CreateUserRequest) {
	err := c.Validate.Struct(users)
	helper.CheckPanic(err)
	userModel := model.User{
		Email:    users.Email,
		Username: users.Username,
		Password: users.Password,
		DOB:      users.DOB,
		Gender:   users.Gender,
		Country:  users.Country,
	}
	c.UserRepository.Save(userModel)
}

func (c *UserServiceImpl) FindAll() []response.UserResponse {
	result := c.UserRepository.FindAll()
	var users []response.UserResponse
	for _, value := range result {
		user := response.UserResponse{
			UserId:           value.UserId,
			Email:            value.Email,
			Username:         value.Username,
			Password:         value.Password,
			DOB:              value.DOB,
			Gender:           value.Gender,
			Country:          value.Country,
			ProfilePageImage: value.ProfilePageImage,
			IsVerified:       value.IsVerified,
			BannerImage:      value.BannerImage,
			AboutMe:          value.AboutMe,
		}
		users = append(users, user)
	}
	return users
}

func (c *UserServiceImpl) FindByEmail(email string) (response.UserResponse, error) {
	result, err := c.UserRepository.FindByEmail(email)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return response.UserResponse{}, gorm.ErrRecordNotFound // Return empty response and the error
	}
	if err != nil {
		helper.CheckPanic(err) // Handle other errors
	}

	user := response.UserResponse{
		UserId:           result.UserId,
		Email:            result.Email,
		Username:         result.Username,
		Password:         result.Password,
		DOB:              result.DOB,
		Gender:           result.Gender,
		Country:          result.Country,
		ProfilePageImage: result.ProfilePageImage,
		IsVerified:       result.IsVerified,
		BannerImage:      result.BannerImage,
		AboutMe:          result.AboutMe,
	}

	return user, nil
}

func (c *UserServiceImpl) ActivateUserEmail(email string) error {
	err := c.UserRepository.ActivateUserEmail(email)
	if err != nil {
		return err
	}
	return nil
}

func (c *UserServiceImpl) ResetUserPassword(user *response.UserResponse) error {

	userModel := model.User{
		UserId:   user.UserId,
		Email:    user.Email,
		Username: user.Username,
		Password: user.Password,
		DOB:      user.DOB,
		Gender:   user.Gender,
		Country:  user.Country,
	}

	err := c.UserRepository.UpdateUser(userModel)
	if err != nil {
		return err
	}
	return nil
}

func (c *UserServiceImpl) UpdateUser(user *response.UserResponse) error {

	userModel := model.User{
		UserId:           user.UserId,
		Email:            user.Email,
		Username:         user.Username,
		Password:         user.Password,
		DOB:              user.DOB,
		Gender:           user.Gender,
		Country:          user.Country,
		ProfilePageImage: user.ProfilePageImage,
		IsVerified:       user.IsVerified,
		IsArtist:         user.IsArtist,
		BannerImage:      user.BannerImage,
		AboutMe:          user.AboutMe,
	}

	err := c.UserRepository.UpdateUser(userModel)
	if err != nil {
		return err
	}
	return nil
}

func (c *UserServiceImpl) EditProfileUser(user *response.UserResponse) error {

	userModel := model.User{
		UserId:   user.UserId,
		Email:    user.Email,
		Username: user.Username,
		Password: user.Password,
		DOB:      user.DOB,
		Gender:   user.Gender,
		Country:  user.Country,
	}

	err := c.UserRepository.UpdateUser(userModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *UserServiceImpl) GetUserToVerify() (response.UserVerificationResponse, error) {

	userVerificationInfo, err := s.UserRepository.GetUserToVerify()
	if err != nil {
		return response.UserVerificationResponse{}, err
	}

	userVerificationResponse := response.UserVerificationResponse{
		Users:          userVerificationInfo.Users,
		FollowingCount: userVerificationInfo.FollowingCount,
		FollowerCount:  userVerificationInfo.FollowerCount,
	}

	return userVerificationResponse, nil
}

func (s *UserServiceImpl) GetUserByArtistId(artistId uint) response.UserResponse {
	user := s.UserRepository.FindByArtistId(artistId)
	userResponse := response.UserResponse{
		UserId:           user.UserId,
		Email:            user.Email,
		Username:         user.Username,
		Password:         user.Password,
		Gender:           user.Gender,
		DOB:              user.DOB,
		Country:          user.Country,
		ProfilePageImage: user.ProfilePageImage,
		IsVerified:       user.IsVerified,
		IsArtist:         user.IsArtist,
		BannerImage:      user.BannerImage,
		AboutMe:          user.AboutMe,
	}
	return userResponse
}
