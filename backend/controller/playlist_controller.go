package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/service"
	"github.com/gin-gonic/gin"
)

type PLaylistController struct {
	PlaylistService service.PlaylistService
}

type PlaylistReq struct {
	UserId int `json:"userId"`
}

type PlaylistDetailReq struct {
	PlaylistId int `json:"playlistid"`
}

type TrackIdReq struct{
	TrackId int `json:"trackid"`
}


func NewPlaylistController(playlistservice service.PlaylistService) *PLaylistController{
	return &PLaylistController{
		PlaylistService: playlistservice,
	}
}

func (controller *PLaylistController) CreatePlaylist(ctx *gin.Context){
	playlistReq := request.CreatePlaylistRequest{}
	form, err := ctx.MultipartForm()
	helper.CheckPanic(err)
	playlistitle := form.Value["title"]
	playlistdesc := form.Value["desc"]
	creatorId := form.Value["creatorid"]
	playlistimg := form.File["file"]

	creatorIds, err := strconv.ParseUint(creatorId[0], 10, 32)
	helper.CheckPanic(err)
	ctx.SaveUploadedFile(playlistimg[0], "files/"+playlistimg[0].Filename)
	playlistReq.CreatorID = uint(creatorIds)
	playlistReq.PlaylistTitle = playlistitle[0]
	playlistReq.PlaylistDescription = playlistdesc[0]
	playlistReq.PlaylistImage = playlistimg[0].Filename

	controller.PlaylistService.CreatePlaylist(playlistReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *PLaylistController) GetUserPlaylist(ctx *gin.Context){
	var req PlaylistReq
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("User id = ",req.UserId)

	result := controller.PlaylistService.GetUserPlaylist(uint(req.UserId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *PLaylistController) AddToPlaylist(ctx *gin.Context){
	addToPlaylistReq := request.AddToPlaylistRequest{}
	err := ctx.ShouldBindJSON(&addToPlaylistReq)
	addToPlaylistReq.DateAdded = time.Now()
	helper.CheckPanic(err)
	fmt.Println(addToPlaylistReq)

	controller.PlaylistService.AddToPlaylist(addToPlaylistReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *PLaylistController) GetPlaylistDetail(ctx *gin.Context){
	var req PlaylistDetailReq
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println(req)

	result := controller.PlaylistService.GetPlaylistDetail(uint(req.PlaylistId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *PLaylistController) GetPlaylistByPlaylistId(ctx *gin.Context){
	var req PlaylistDetailReq
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println(req)

	result := controller.PlaylistService.GetPlaylistById(uint(req.PlaylistId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *PLaylistController) DeletePlaylist (ctx *gin.Context){
	var req PlaylistDetailReq
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println(req)

	controller.PlaylistService.DeletePlaylist(uint(req.PlaylistId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *PLaylistController) DeletePlaylistTrack (ctx *gin.Context){
	req := request.DeletePlaylistTrackReq{}
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println(req)

	controller.PlaylistService.DeletePlaylistTrack(uint(req.PlaylistId),uint(req.TrackId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}
func (controller *PLaylistController) GetPlaylistDetailByTrackId (ctx *gin.Context){
	var req TrackIdReq
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println(req)

	result := controller.PlaylistService.GetPlaylistDetailByTrackId(uint(req.TrackId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)

}