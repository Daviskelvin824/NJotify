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
	"gorm.io/gorm"
)

type AlbumController struct {
	albumService service.AlbumService
	db           *gorm.DB
}
type AlbumRequest struct {
	ArtistId int `json:"artistid"`
}

type AlbumIdRequest struct{
	AlbumId uint `json:"albumid"`
}

type PageReq struct{
	PageId int `json:"pageid"`
}

func NewAlbumController(service service.AlbumService) *AlbumController {
	return &AlbumController{
		albumService: service,
	}
}

func(controller *AlbumController) GetAllAlbum(ctx *gin.Context){
	result := controller.albumService.GetAllAlbum()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:  result,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}
func(controller *AlbumController) GetAllTrack(ctx *gin.Context){
	result := controller.albumService.GetAllTrack()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:  result,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *AlbumController) CreateAlbum(ctx *gin.Context) {
	createAlbumReq := request.CreateAlbumRequest{}

	user, err := helper.GetUserFromMiddleware(ctx)
	helper.CheckPanic(err)

	form, err := ctx.MultipartForm()
	helper.CheckPanic(err)
	files := form.File["file"]
	ctx.SaveUploadedFile(files[0], "files/"+files[0].Filename)
	name := form.Value["name"]
	albumtype := form.Value["type"]

	createAlbumReq.AlbumName = name[0]
	createAlbumReq.ImagePath = files[0].Filename
	createAlbumReq.ArtistID = user.UserId
	createAlbumReq.AlbumType = albumtype[0]
	createAlbumReq.CreatedAt = time.Now()
	fmt.Println(createAlbumReq)
	createdAlbum := controller.albumService.CreateAlbum(createAlbumReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   createdAlbum.AlbumID,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *AlbumController) GetAlbumByArtist(ctx *gin.Context) {
	var req AlbumRequest
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("req = ", req)

	albumResponse := controller.albumService.FindAllAlbumByArtist(req.ArtistId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   albumResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)

}

func (c *AlbumController) GetAlbumById(ctx *gin.Context) {
	var req AlbumRequest
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("req = ", req)
	albumResponse := c.albumService.FindAlbumById(req.ArtistId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   albumResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (c *AlbumController) GetTrackByAlbum(ctx *gin.Context) {
	var req AlbumRequest
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("req = ", req)

	trackResponse := c.albumService.GetTrackByAlbum(req.ArtistId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   trackResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (c *AlbumController) GetTrackByTrackId(ctx *gin.Context) {
	var req AlbumRequest
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("req trackid= ", req)

	trackResponse := c.albumService.GetTrackByTrackId(req.ArtistId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   trackResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *AlbumController) GetFile(ctx *gin.Context) {
	path, success := ctx.Params.Get("path")
	if success {
		ctx.File("files/" + path)
	}

}

func (controller *AlbumController) CreateTrack(ctx *gin.Context) {
	createTrackReq := request.CreateTrackRequest{}

	form, err := ctx.MultipartForm()
	helper.CheckPanic(err)
	albumIDStr := form.Value["id"]
	albumID, err := strconv.Atoi(albumIDStr[0])
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Album ID",
		})
		return
	}
	files := form.File["trackpaths"]
	names := form.Value["tracknames"]
	fmt.Println(files, names)
	filePaths := make([]string, len(files))
	for i, file := range files {
		filePath := file.Filename
		err := ctx.SaveUploadedFile(file, "files/"+file.Filename)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to save file",
			})
			return
		}
		filePaths[i] = filePath
	}
	createTrackReq.AlbumID = uint(albumID)
	createTrackReq.TrackTitles = names
	createTrackReq.FilePaths = filePaths
	controller.albumService.CreateTrack(createTrackReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *AlbumController) GetPopularTrackByArtist(ctx *gin.Context) {
	var req AlbumRequest
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("req = ", req)

	responses := controller.albumService.GetPopularTrackByArtist(req.ArtistId)
	fmt.Println("popular artist = ", responses)

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   responses,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *AlbumController) GetPopularTrackByAlbum(ctx *gin.Context) {
	var req AlbumIdRequest
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("req = ", req)

	responses := controller.albumService.GetPopularTrackByAlbum(int(req.AlbumId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   responses,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *AlbumController) GetMostPlayedTrackByArtist(ctx *gin.Context) {
	var req AlbumRequest
	err := ctx.ShouldBindJSON(&req)
	helper.CheckPanic(err)
	fmt.Println("req = ", req)

	responses := controller.albumService.GetMostPlayedTrackByArtist(req.ArtistId)
	fmt.Println("popular artist = ", responses)

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   responses,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func (controller *AlbumController) AddTrackHistory(ctx *gin.Context){
	historyReq := request.AddTrackHistoryRequest{}
	err := ctx.ShouldBindJSON(&historyReq)
	helper.CheckPanic(err)
	historyReq.CreatedAt = time.Now()
	controller.albumService.AddTrackHistory(historyReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)

}

func (controller *AlbumController) AddAlbumHistory(ctx *gin.Context){
	historyReq := request.AlbumHistoryRequest{}
	err := ctx.ShouldBindJSON(&historyReq)
	helper.CheckPanic(err)
	historyReq.CreatedAt = time.Now()
	controller.albumService.AddAlbumHistory(historyReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)

}

func (controller *AlbumController) GetRecentTrack(ctx *gin.Context){
	var userId ArtistRequest
	err := ctx.ShouldBindJSON(&userId)
	helper.CheckPanic(err)
	result := controller.albumService.GetRecentTrack(uint(userId.ArtistId))
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}

func(controller *AlbumController) GetAlbumByAlbumId(ctx *gin.Context){
	var albumId AlbumIdRequest
	err := ctx.ShouldBindJSON(&albumId)
	helper.CheckPanic(err)

	result := controller.albumService.GetAlbumByAlbumId(albumId.AlbumId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)

}

func(controller *AlbumController) ShowMoreAlbum(ctx *gin.Context){
	pageIdStr := ctx.Query("pageid")
	fmt.Println(pageIdStr)
	pageId, err := strconv.Atoi(pageIdStr)
	helper.CheckPanic(err)
	result := controller.albumService.GetAllAlbumPaginated(pageId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
	
}
func(controller *AlbumController) ShowMoreRecentAlbum(ctx *gin.Context){
	pageIdStr := ctx.Query("pageid")

	user, err := helper.GetUserFromMiddleware(ctx)
	helper.CheckPanic(err)

	fmt.Println(pageIdStr)
	pageId, err := strconv.Atoi(pageIdStr)
	helper.CheckPanic(err)
	result := controller.albumService.GetAllRecentAlbumPaginated(int(user.UserId),pageId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
	
}

func(controller *AlbumController) ShowMoreTrack(ctx *gin.Context){
	pageIdStr := ctx.Query("pageid")
	fmt.Println(pageIdStr)
	pageId, err := strconv.Atoi(pageIdStr)
	helper.CheckPanic(err)
	result := controller.albumService.GetAllTrackPaginated(pageId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   result,
	}	
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
	
}
