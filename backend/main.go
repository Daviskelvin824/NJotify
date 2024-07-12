package main

import (
	"net/http"

	"github.com/Daviskelvin824/TPA-Website/controller"
	"github.com/Daviskelvin824/TPA-Website/database"
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/repository"
	"github.com/Daviskelvin824/TPA-Website/router"
	"github.com/Daviskelvin824/TPA-Website/service"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOuthConfig = &oauth2.Config{}

func init() {
	err := godotenv.Load()
	helper.CheckPanic(err)
	googleOuthConfig = &oauth2.Config{
		ClientID:     "749857715630-k3r648nbnckvs3u73tpomc50t8iv8rbu.apps.googleusercontent.com",
		ClientSecret: "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",
		RedirectURL:  "http://localhost:5173/",
		Scopes:       []string{"profile", "email"},
		Endpoint:     google.Endpoint,
	}
}

// func handleGoogleCallback(c *gin.Context) {
// 	code := c.Query("code")

// 	token, err := googleOuthConfig.Exchange(c, code)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
// 		return
// 	}
// 	accessToken := token.AccessToken

// 	// Get user info using the access token
// 	userInfo, err := getUserInfo(accessToken)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info"})
// 		return
// 	}

// 	// Return user info to the frontend
// 	c.JSON(http.StatusOK, gin.H{"user": userInfo})
// }

// func getUserInfo(accessToken string) (map[string]interface{}, error) {
// 	userInfoEndPoint := "https://www.googleapis.com/oauth2/v2/userinfo"
// 	resp, err := http.Get(fmt.Sprintf("%s?access_token=%s", userInfoEndPoint, accessToken))
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer resp.Body.Close()

// 	var userInfo map[string]interface{}
// 	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
// 		return nil, err
// 	}

// 	return userInfo, nil
// }

func main() {
	gin.SetMode(gin.ReleaseMode)
	routes := gin.Default()
	validator := validator.New()

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Adjust this as needed
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(routes)
	db := database.ConnectDb()
	//set repo
	userRepo := repository.NewUserRepositoryImpl(db)
	albumRepo := repository.NewAlbumRepositoryImpl(db)

	//set service
	userService := service.NewUserServiceImpl(userRepo, validator)
	albumService := service.NewAlbumServiceImpl(albumRepo, validator)

	// set controller
	userController := controller.NewUserController(userService)
	albumController := controller.NewAlbumController(albumService)

	//set routing
	router.UserRoute(routes, userController)
	router.AlbumRoute(routes, albumController)

	server := &http.Server{
		Addr:    ":8888",
		Handler: corsHandler,
	}
	// routes.GET("/auth/google/callback", handleGoogleCallback)

	err := server.ListenAndServe()
	helper.CheckPanic(err)
}
