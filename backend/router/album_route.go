package router

import (
	"github.com/Daviskelvin824/TPA-Website/controller"
	"github.com/gin-gonic/gin"
)

func AlbumRoute(router *gin.Engine, albumController *controller.AlbumController, authMiddleware gin.HandlerFunc) {
	router.GET("/getallalbum", albumController.GetAllAlbum)
	router.GET("/getalltrack", albumController.GetAllTrack)
	router.POST("/create-album", authMiddleware, albumController.CreateAlbum)
	router.POST("/create-track", albumController.CreateTrack)
	router.GET("/files/:path", albumController.GetFile)
	router.POST("/getalbumbyartist", albumController.GetAlbumByArtist)
	router.POST("/getalbumbyid", albumController.GetAlbumById)
	router.POST("/gettracksbyalbum", albumController.GetTrackByAlbum)
	router.POST("/gettracksbytrackid", albumController.GetTrackByTrackId)
	router.POST("/getpopulartrackbyartist", albumController.GetPopularTrackByArtist)
	router.POST("/getpopulartrackbyalbum", albumController.GetPopularTrackByAlbum)
	router.POST("/getmostplayedtrackbyartist", albumController.GetMostPlayedTrackByArtist)
	router.POST("/addtrackhistory", albumController.AddTrackHistory)
	router.POST("/addalbumhistory", albumController.AddAlbumHistory)
	router.POST("/getrecenttrack", albumController.GetRecentTrack)
	router.POST("/getalbumbyalbumid", albumController.GetAlbumByAlbumId)
	router.GET("/showmore/album", albumController.ShowMoreAlbum)
	router.GET("/showmore/recentalbum", authMiddleware, albumController.ShowMoreRecentAlbum)
	router.GET("/showmore/track", albumController.ShowMoreTrack)
}
