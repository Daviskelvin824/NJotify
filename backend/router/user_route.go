package router

import (
	"github.com/Daviskelvin824/TPA-Website/controller"
	"github.com/Daviskelvin824/TPA-Website/middleware"
	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine, userController *controller.UserController) {
	router.GET("/get-users", userController.FindAll)
	router.POST("/signup", userController.Create)
	router.POST("/login", userController.Signin)
	router.GET("/validate", middleware.Validate, userController.Authenticate)
	router.GET("/verify", userController.Verify)
	router.POST("/findaccount", userController.FindAccount)
	router.GET("/forgotpassword", userController.ForgotPassword)
	router.POST("/resetpassword", userController.ResetPassword)
	router.GET("/logout", userController.Logout)
	router.POST("/editprofile", userController.EditProfile)
	router.POST("/getverified", userController.GetVerified)
	router.GET("/getusertoverify", userController.GetUserToVerify)
	router.POST("/handlereject", userController.HandleReject)
	router.POST("/handleaccept", userController.HandleAccept)
	router.POST("/getartist", userController.GetArtist)
	router.GET("/getallartist", userController.FindAllArtist)
	router.POST("/addprofileimage",userController.AddProfileImage)
	router.POST("/getuserbyusername",userController.GetUserByUsername)
	router.POST("/getFFM", userController.GetFFM)
	router.POST("/followperson", userController.FollowPerson)
	router.POST("/unfollowperson", userController.UnFollowPerson)
	router.POST("/validateuserfollowing", userController.ValidateFollowing)
	router.GET("/showmore/following", userController.ShowMoreFollowing)
	router.GET("/showmore/follower", userController.ShowMoreFollower)
	router.POST("/updateusernotif", userController.UpdateUserNotif)
}
