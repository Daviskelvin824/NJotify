package controller

import (
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"os"
	"strconv"
	"time"

	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/middleware"
	"github.com/Daviskelvin824/TPA-Website/service"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserController struct {
	userService service.UserService
	db          *gorm.DB
}

func NewUserController(service service.UserService) *UserController {
	return &UserController{
		userService: service,
	}
}

type ArtistRequest struct {
	ArtistId int `json:"artistid"`
}

type EmailRequest struct{
	Email string `json:"email"`
}

func (controller *UserController) Create(ctx *gin.Context) {
	createUserReq := request.CreateUserRequest{}
	err := ctx.ShouldBindJSON(&createUserReq)
	helper.CheckPanic(err)
	fmt.Println(createUserReq)

	// Validate password
	if !helper.ValidatePassword(createUserReq.Password) {
		ctx.String(http.StatusBadRequest, "Password must be alphanumeric and include a symbol")
		return
	}

	// Validate email format
	if _, err = mail.ParseAddress(createUserReq.Email); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid email format")
		return
	}

	//Check if username is already registered
	userusername, _:=controller.userService.FindByUsername(createUserReq.Username)
	fmt.Println("user = ",userusername)
	if(userusername.Email!=""){
		ctx.JSON(200, "Username Already Exist!")
		return
	}

	// Check if email is already registered
	existingUser, err := controller.userService.FindByEmail(createUserReq.Email)



	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Email is not registered, proceed with user creation
		// Hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(createUserReq.Password), bcrypt.DefaultCost)
		helper.CheckPanic(err)
		createUserReq.Password = string(hashedPassword)

		//generate jwt
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"subject": createUserReq.Email,
			"expire":  time.Now().Add(time.Hour * 24 * 30).Unix(),
		})

		tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
		if err != nil {
			ctx.String(200, "Failed to Create Token")
			return
		}
		// Send verification email
		err = helper.SendVerificationEmail(tokenString, createUserReq.Email)
		if err != nil {
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send verification email"})
			return
		}
		// Create user
		controller.userService.Create(createUserReq)
		webResponse := response.WebResponse{
			Code:   http.StatusOK,
			Status: "Ok",
			Data:   nil,
		}
		ctx.Header("Content-type", "application/json")
		ctx.JSON(http.StatusOK, webResponse.Data)

		return
	} else if existingUser.Email != "" {
		// Email is already registered
		ctx.String(200, "Email is already registered")
		return
	} else {
		// Handle other potential errors
		ctx.String(http.StatusInternalServerError, "Internal Server Error")
		return
	}
}

func (controller *UserController) FindAll(ctx *gin.Context) {
	fmt.Println("Fetching All Data...")
	userReponse := controller.userService.FindAll()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userReponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *UserController) FindAllArtist(ctx *gin.Context) {
	fmt.Println("Fetching All Data...")
	userReponse := controller.userService.FindAllArtist()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userReponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *UserController) Signin(ctx *gin.Context) {
	signInUserReq := request.SignInUserRequest{}
	err := ctx.ShouldBindJSON(&signInUserReq)
	helper.CheckPanic(err)
	fmt.Println(signInUserReq)

	user, err := controller.userService.FindByEmail(signInUserReq.Email)
	fmt.Println(user)
	if user.Email == "" {
		ctx.JSON(200, "Email is incorrect")
		return
	}
	if err != nil {
		fmt.Println(err.Error())
		if err.Error() == "record not found" {
			ctx.JSON(200, "Email is incorrect")
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "An error occurred"})
		return
	}

	if user.DOB.After(time.Now()) {
		ctx.JSON(200, "DOB must be in the past!")
		return
	}
	//check pass
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(signInUserReq.Password))
	if err != nil {
		ctx.String(200, "Password is incorrect")
		return
	}

	//check activation
	if !user.IsVerified {
		ctx.JSON(200, "Activate your Account in Gmail!")
		return
	}

	//generate jwt
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"subject": user.Email,
		"expire":  time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		ctx.String(200, "Failed to Create Token")
		return
	}
	fmt.Println("Token from cookie:", tokenString)
	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie("Auth", tokenString, 3600*24*30, "", "", false, true)
}

func (controller *UserController) Authenticate(c *gin.Context) {
	user, _ := c.Get("user")
	c.JSON(http.StatusOK, user)
}

func (controller *UserController) Verify(ctx *gin.Context) {
	tokenString := ctx.Query("token")
	if tokenString == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
		return
	}

	// Parse the JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Make sure that the token's signature method matches our expectation
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET")), nil
	})
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to parse token"})
		return
	}

	// Extract the email from the token claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		email, ok := claims["subject"].(string)
		if !ok {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token claims"})
			return
		}

		err := controller.userService.ActivateUserEmail(email)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify account"})
			return
		}

		ctx.Redirect(http.StatusSeeOther, "http://localhost:5173/login")
	} else {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
	}
}

func (controller *UserController) FindAccount(ctx *gin.Context) {
	var requestData struct {
		Email string `json:"email"`
	}
	err := ctx.ShouldBindJSON(&requestData)
	fmt.Println(requestData.Email)
	helper.CheckPanic(err)

	if _, err = mail.ParseAddress(requestData.Email); err != nil {
		ctx.JSON(200, "Invalid email format")
		return
	}

	user, err := controller.userService.FindByEmail(requestData.Email)
	helper.CheckPanic(err)
	fmt.Println(user)
	if user.Email == "" {
		ctx.JSON(200, "Account Not Found")
		return
	}

	//check activation
	if !user.IsVerified {
		ctx.JSON(200, "Activate your Account in Gmail!")
		return
	}

	sendEmail := helper.SendForgotPasswordEmail(requestData.Email)
	if sendEmail != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send verification email"})
		return
	}
}

func (controller *UserController) ForgotPassword(ctx *gin.Context) {
	email := ctx.Query("email")
	if email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
		return
	}
	//generate jwt
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"subject": email,
		"expire":  time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		ctx.String(200, "Failed to Create Token")
		return
	}
	redirectURL := fmt.Sprintf("http://localhost:5173/forgot-password?token=%s", tokenString)
	ctx.Redirect(http.StatusSeeOther, redirectURL)
}

func (controller *UserController) ResetPassword(ctx *gin.Context) {
	resetReq := request.SignInUserRequest{}
	err := ctx.ShouldBindJSON(&resetReq)
	helper.CheckPanic(err)
	fmt.Println(resetReq)

	// Validate password
	if !helper.ValidatePassword(resetReq.Password) {
		ctx.JSON(200, "Invalid Password Format!")
		return
	}

	//parse jwt
	token, err := jwt.Parse(resetReq.Email, func(token *jwt.Token) (interface{}, error) {
		// Make sure that the token's signature method matches our expectation
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET")), nil
	})
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to parse token"})
		return
	}

	// Extract the email from the token claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		email, ok := claims["subject"].(string)
		if !ok {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token claims"})
			return
		}

		// Validate the last password is not the same as the new password
		user, err := controller.userService.FindByEmail(email)
		helper.CheckPanic(err)
		fmt.Println(user)
		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(resetReq.Password))
		if err == nil {
			// Passwords match, new password cannot be the same as the old password
			ctx.JSON(200, "New password cannot be the same as the old password")
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(resetReq.Password), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}

		//tinggal update
		user.Password = string(hashedPassword)
		resetErr := controller.userService.UpdateUser(&user)
		if resetErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
			return
		}
	} else {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
	}


}

func (controller *UserController) Logout(ctx *gin.Context) {
	ctx.SetCookie("Auth", "", -1, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, "Successfully logged out")
}

func (controller *UserController) EditProfile(ctx *gin.Context) {
	editReq := request.EditProfileRequest{}
	err := ctx.ShouldBindJSON(&editReq)
	helper.CheckPanic(err)
	fmt.Println(editReq)

	user, err := controller.userService.FindByEmail(editReq.Email)
	helper.CheckPanic(err)
	fmt.Println(user)

	user.Gender = editReq.Gender
	user.DOB = editReq.DOB
	user.Country = editReq.Country

	resetErr := controller.userService.UpdateUser(&user)
	if resetErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	ctx.JSON(http.StatusOK, "Successfully logged out")
}

func (controller *UserController) GetVerified(ctx *gin.Context) {
	verifiedReq := request.GetVerifiedRequest{}

	form, err := ctx.MultipartForm()
	helper.CheckPanic(err)
	email := form.Value["email"]
	aboutme := form.Value["about"]
	files := form.File["banner"]
	verifiedReq.BannerImage = files[0].Filename
	verifiedReq.Email = email[0]
	verifiedReq.AboutMe = aboutme[0]

	fmt.Println(verifiedReq.Email, verifiedReq.AboutMe, verifiedReq.BannerImage)

	ctx.SaveUploadedFile(files[0], "files/"+files[0].Filename)

	user, err := controller.userService.FindByEmail(verifiedReq.Email)
	helper.CheckPanic(err)
	fmt.Println(user)
	fmt.Println(verifiedReq)
	user.BannerImage = &verifiedReq.BannerImage
	user.AboutMe = &verifiedReq.AboutMe
	resetErr := controller.userService.UpdateUser(&user)
	if resetErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}
}

func (controller *UserController) GetUserToVerify(ctx *gin.Context) {
	userVerificationInfo, err := controller.userService.GetUserToVerify()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users to verify"})
		return
	}

	// Convert to response format if necessary
	responseData := response.UserVerificationResponse{
		Users:          userVerificationInfo.Users,
		FollowingCount: userVerificationInfo.FollowingCount,
		FollowerCount:  userVerificationInfo.FollowerCount,
	}

	ctx.JSON(http.StatusOK, responseData)
}

func (controller *UserController) HandleAccept(ctx *gin.Context) {
	verifiedReq := request.GetVerifiedRequest{}
	err := ctx.ShouldBindJSON(&verifiedReq)

	helper.CheckPanic(err)
	user, err := controller.userService.FindByEmail(verifiedReq.Email)

	user.IsArtist = true
	helper.CheckPanic(err)

	resetErr := controller.userService.UpdateUser(&user)
	if resetErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	ctx.JSON(http.StatusOK, "Successfully logged out")
}

func (controller *UserController) HandleReject(ctx *gin.Context) {
	verifiedReq := request.GetVerifiedRequest{}
	err := ctx.ShouldBindJSON(&verifiedReq)
	helper.CheckPanic(err)
	fmt.Println(verifiedReq)
	user, err := controller.userService.FindByEmail(verifiedReq.Email)
	user.IsArtist = false
	user.BannerImage = nil
	user.AboutMe = nil
	helper.CheckPanic(err)

	resetErr := controller.userService.UpdateUser(&user)
	if resetErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	ctx.JSON(http.StatusOK, "Successfully logged out")
}

func (controller *UserController) GetArtist(ctx *gin.Context) {
	var req ArtistRequest
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("req = ", req)

	result := controller.userService.GetUserByArtistId(uint(req.ArtistId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *UserController) AddProfileImage(ctx *gin.Context){
	form, err := ctx.MultipartForm()
	helper.CheckPanic(err)
	email := form.Value["email"]
	files := form.File["profileimg"]

	profileReq := request.AddProfileImageRequest{}
	profileReq.Email = email[0]
	profileReq.ProfileImage = files[0].Filename
	ctx.SaveUploadedFile(files[0], "files/"+files[0].Filename)

	user,err := controller.userService.FindByEmail(profileReq.Email)
	helper.CheckPanic(err)

	user.ProfilePageImage = &profileReq.ProfileImage
	resetErr := controller.userService.UpdateUser(&user)
	if resetErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

}

func(controller *UserController) GetUserByUsername(ctx *gin.Context){
	var email EmailRequest
	err := ctx.ShouldBindJSON(&email)
	helper.CheckPanic(err)
	fmt.Println("req = ", email)

	user,err := controller.userService.FindByUsername(email.Email)
	helper.CheckPanic(err)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   user,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func(controller *UserController) GetFFM(ctx *gin.Context){
	var userId ArtistRequest
	err := ctx.ShouldBindJSON(&userId)
	helper.CheckPanic(err)
	fmt.Println("req = ", userId)

	result := controller.userService.GetFFM(uint(userId.ArtistId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func(controller *UserController) FollowPerson(ctx *gin.Context){
	followReq := request.FollowRequest{}
	err := ctx.ShouldBindJSON(&followReq)
	helper.CheckPanic(err)
	fmt.Println(followReq)
	controller.userService.FollowPerson(followReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}
func(controller *UserController) UnFollowPerson(ctx *gin.Context){
	followReq := request.FollowRequest{}
	err := ctx.ShouldBindJSON(&followReq)
	helper.CheckPanic(err)
	fmt.Println(followReq)
	controller.userService.UnFollowPerson(followReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func(controller *UserController) ValidateFollowing(ctx *gin.Context){
	followReq := request.FollowRequest{}
	err := ctx.ShouldBindJSON(&followReq)
	helper.CheckPanic(err)
	fmt.Println(followReq)
	response2 := controller.userService.ValidateFollowing(followReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   response2,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func(controller *UserController) ShowMoreFollowing(ctx *gin.Context){
	pageIdStr := ctx.Query("pageid")
	creatorIdStr := ctx.Query("userId")
	pageId, err := strconv.Atoi(pageIdStr)
	helper.CheckPanic(err)
	creatorId, err2 := strconv.Atoi(creatorIdStr)
	helper.CheckPanic(err2)
	result := controller.userService.GetFollowingPaginated(creatorId,pageId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func(controller *UserController) ShowMoreFollower(ctx *gin.Context){
	pageIdStr := ctx.Query("pageid")
	creatorIdStr := ctx.Query("userId")
	pageId, err := strconv.Atoi(pageIdStr)
	helper.CheckPanic(err)
	creatorId, err2 := strconv.Atoi(creatorIdStr)
	helper.CheckPanic(err2)
	result := controller.userService.GetFollowerPaginated(creatorId,pageId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func(controller *UserController) UpdateUserNotif(ctx *gin.Context){
	notifReq := request.UpdateNotifRequest{}
	err := ctx.ShouldBindJSON(&notifReq)
	helper.CheckPanic(err)

	user,err2 := middleware.GetUserFromJWT(ctx)
	helper.CheckPanic(err2)

	currUser,_ := controller.userService.FindByEmail(user.Email)
	currUser.ArtistNotification = &notifReq.ArtistNotif
	currUser.FollowerNotification = &notifReq.FollowerNotif
	resetErr := controller.userService.UpdateUser(&currUser)
	if resetErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}
}