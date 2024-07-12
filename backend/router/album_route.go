package router

import (
	"github.com/Daviskelvin824/TPA-Website/controller"
	"github.com/Daviskelvin824/TPA-Website/middleware"
	"github.com/gin-gonic/gin"
)

func AlbumRoute(router *gin.Engine, albumController *controller.AlbumController) {
	router.POST("/create-album", middleware.Validate, albumController.CreateAlbum)
	router.POST("/create-track", albumController.CreateTrack)
	router.GET("/files/:path", albumController.GetFile)
	router.POST("/getalbumbyartist", albumController.GetAlbumByArtist)
	router.POST("/getalbumbyid", albumController.GetAlbumById)
	router.POST("/gettracksbyalbum", albumController.GetTrackByAlbum)
	router.POST("/gettracksbytrackid", albumController.GetTrackByTrackId)
	router.POST("/getpopulartrackbyartist", albumController.GetPopularTrackByArtist)
}
