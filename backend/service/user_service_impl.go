package service

import (
	"errors"
	"fmt"
	"strconv"
	"time"

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
	RedisService RedisService
}

func NewUserServiceImpl(userRepository repository.UserRepository, redisService RedisService,validate *validator.Validate) UserService {
	return &UserServiceImpl{
		RedisService: redisService,
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
		IsVerified: false,
		IsArtist: false,
	}
	c.UserRepository.Save(userModel)
	c.RedisService.ClearKeyFromRedis("verification_requests")

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
			IsArtist: value.IsArtist,
			BannerImage:      value.BannerImage,
			AboutMe:          value.AboutMe,
			ArtistNotification: value.ArtistNotification,
			FollowerNotification: value.FollowerNotification,
		}
		users = append(users, user)
	}
	return users
}
func (c *UserServiceImpl) FindAllArtist() []response.UserResponse {
	result := c.UserRepository.FindAllArtist()
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
			IsArtist: value.IsArtist,
			BannerImage:      value.BannerImage,
			AboutMe:          value.AboutMe,
			ArtistNotification: value.ArtistNotification,
			FollowerNotification: value.FollowerNotification,
		}
		users = append(users, user)
	}
	return users
}

func (c *UserServiceImpl) FindByEmail(email string) (response.UserResponse, error) {
	var userRedis response.UserResponse
	err:=c.RedisService.GetData("user_by_email:"+email, &userRedis)
	if(err==nil){
		return userRedis,nil
	}
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
		IsArtist: 		  result.IsArtist,
		BannerImage:      result.BannerImage,
		AboutMe:          result.AboutMe,
		ArtistNotification: result.ArtistNotification,
		FollowerNotification: result.FollowerNotification,
	}

	//habis fetch db, jangan lupa masukin redis
	err = c.RedisService.SetData("user_by_email:"+email,user, time.Minute*10)
	fmt.Println(err)

	return user, nil
}
func (c *UserServiceImpl) FindByUsername(username string) (response.UserResponse, error) {
	var userRedis response.UserResponse
	err2:=c.RedisService.GetData("user_by_username:"+username, &userRedis)
	if(err2==nil){
		return userRedis,nil
	}
	result, err := c.UserRepository.FindByUsername(username)
	fmt.Println("result = ",result)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return response.UserResponse{}, gorm.ErrRecordNotFound 
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
		IsArtist: 		  result.IsArtist,
		BannerImage:      result.BannerImage,
		AboutMe:          result.AboutMe,
		ArtistNotification: result.ArtistNotification,
		FollowerNotification: result.FollowerNotification,
	}

	//habis fetch db, jangan lupa masukin redis
	err = c.RedisService.SetData("user_by_username:"+username,user, time.Minute*10)
	fmt.Println(err)

	return user, nil
}

func (c *UserServiceImpl) ActivateUserEmail(email string) error {
	err := c.UserRepository.ActivateUserEmail(email)
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
		ArtistNotification: user.ArtistNotification,
		FollowerNotification: user.FollowerNotification,
	}

	err := c.UserRepository.UpdateUser(userModel)
	c.RedisService.ClearKeyFromRedis("user_by_id:" + strconv.Itoa(int(user.UserId)))
	c.RedisService.ClearKeyFromRedis("user_by_username:" + user.Username)
	c.RedisService.ClearKeyFromRedis("user_by_email:" + user.Email)
	c.RedisService.ClearKeyFromRedis("verification_requests:" + "user")
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
		ProfilePageImage: user.ProfilePageImage,
		IsVerified: user.IsVerified,
		IsArtist: user.IsArtist,
		BannerImage: user.BannerImage,
		AboutMe: user.AboutMe,
		ArtistNotification: user.ArtistNotification,
		FollowerNotification: user.FollowerNotification,
	}

	err := c.UserRepository.UpdateUser(userModel)
	c.RedisService.ClearKeyFromRedis("user_by_id:" + strconv.Itoa(int(user.UserId)))
	c.RedisService.ClearKeyFromRedis("user_by_username:" + user.Username)
	c.RedisService.ClearKeyFromRedis("user_by_email:" + user.Email)
	c.RedisService.ClearKeyFromRedis("verification_requests:" + "user")
	if err != nil {
		return err
	}
	return nil
}

func (s *UserServiceImpl) GetUserToVerify() (response.UserVerificationResponse, error) {
	var userRedis response.UserVerificationResponse
	err2:=s.RedisService.GetData("verification_requests:"+"user" ,&userRedis)
	if(err2==nil){
		return userRedis,nil
	}
	userVerificationInfo, err := s.UserRepository.GetUserToVerify()
	if err != nil {
		return response.UserVerificationResponse{}, err
	}

	userVerificationResponse := response.UserVerificationResponse{
		Users:          userVerificationInfo.Users,
		FollowingCount: userVerificationInfo.FollowingCount,
		FollowerCount:  userVerificationInfo.FollowerCount,
	}
	err = s.RedisService.SetData("verification_requests:"+"user",userVerificationResponse, time.Minute*10)
	fmt.Println(err)
	return userVerificationResponse, nil
}

func (s *UserServiceImpl) GetUserByArtistId(artistId uint) response.UserResponse {
	var artistRedis response.UserResponse
	artistIdStr := strconv.FormatUint(uint64(artistId), 10)
	err2:=s.RedisService.GetData("artist_by_id:"+artistIdStr ,&artistRedis)
	if(err2==nil){
		return artistRedis
	}
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
		ArtistNotification: user.ArtistNotification,
		FollowerNotification: user.FollowerNotification,
	}
	err := s.RedisService.SetData("artist_by_id:"+artistIdStr,userResponse, time.Minute*10)
	fmt.Println(err)
	return userResponse
}

func (c *UserServiceImpl) GetFFM(userId uint) response.FFMResponse{
	result := c.UserRepository.GetFFM(userId)
	return result
}

func(c *UserServiceImpl) FollowPerson(req request.FollowRequest){
	followModel := model.Follow{
		FollowingID: req.FollowingId,
		FollowerID: req.FollowerId,
	}
	c.UserRepository.FollowPerson(followModel)
}
func(c *UserServiceImpl) UnFollowPerson(req request.FollowRequest){
	followModel := model.Follow{
		FollowingID: req.FollowingId,
		FollowerID: req.FollowerId,
	}
	c.UserRepository.UnFollowPerson(followModel)
}

func (c *UserServiceImpl) ValidateFollowing(req request.FollowRequest) bool{
	followModel := model.Follow{
		FollowingID: req.FollowingId,
		FollowerID: req.FollowerId,
	}
	response := c.UserRepository.ValidateFollowing(followModel)
	return response
}

func (c *UserServiceImpl) GetFollowingPaginated(userId int, pageId int) []response.UserResponse{
	result := c.UserRepository.GetFollowingPaginated(userId,pageId)
	var users []response.UserResponse
	for _,value := range result{
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
			IsArtist: value.IsArtist,
			BannerImage:      value.BannerImage,
			AboutMe:          value.AboutMe,
			ArtistNotification: value.ArtistNotification,
			FollowerNotification: value.FollowerNotification,
		}
		users = append(users, user)
	}
	return users
}

func (c *UserServiceImpl) GetFollowerPaginated(userId int, pageId int) []response.UserResponse{
	result := c.UserRepository.GetFollowerPaginated(userId,pageId)
	var users []response.UserResponse
	for _,value := range result{
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
			IsArtist: value.IsArtist,
			BannerImage:      value.BannerImage,
			AboutMe:          value.AboutMe,
			ArtistNotification: value.ArtistNotification,
			FollowerNotification: value.FollowerNotification,
		}
		users = append(users, user)
	}
	return users
}

func (c *UserServiceImpl) AddToSearchHistory(req request.AddToSearchHistoryRequest){
	historyModel := model.SearchHistory{
		UserId: req.UserId,
		ResultId: req.ResultId,
		ResultType: req.ResultType,
	}

	c.UserRepository.AddToSearchHistory(historyModel)
}

func (c *UserServiceImpl) GetSearchHistory(userId int)[]response.SearchHistoryResponse{
	result := c.UserRepository.GetSearchHistory(userId)
	var histories []response.SearchHistoryResponse
	for _,value := range result{
		history := response.SearchHistoryResponse{
			SearchHistoryId: value.SearchHistoryId,
			UserId: value.UserId,
			ResultId: value.ResultId,
			ResultType: value.ResultType,
		}
		histories = append(histories, history)
	}
	return histories
}

