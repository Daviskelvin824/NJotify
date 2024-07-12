package router

import (
	"github.com/Daviskelvin824/TPA-Website/controller"
	"github.com/Daviskelvin824/TPA-Website/middleware"
	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine, userController *controller.UserController) {
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
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
}
