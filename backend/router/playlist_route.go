package router

import (
	"github.com/Daviskelvin824/TPA-Website/controller"
	"github.com/gin-gonic/gin"
)

func PlaylistRoute(router *gin.Engine, playlistController *controller.PLaylistController) {
	router.GET("/getallplaylist",playlistController.GetAllPlaylist)
	router.POST("/create-playlist", playlistController.CreatePlaylist)
	router.POST("/getuserplaylist", playlistController.GetUserPlaylist)
	router.POST("/addtoplaylist", playlistController.AddToPlaylist)
	router.POST("/getplaylistdetail", playlistController.GetPlaylistDetail)
	router.POST("/getplaylistbyid", playlistController.GetPlaylistByPlaylistId)
	router.POST("/deleteplaylist", playlistController.DeletePlaylist)
	router.POST("/deleteplaylisttrack", playlistController.DeletePlaylistTrack)
	router.POST("/getplaylistdetailbytrackid", playlistController.GetPlaylistDetailByTrackId)
	router.GET("/showmore/playlist",playlistController.ShowmorePlaylist)
}