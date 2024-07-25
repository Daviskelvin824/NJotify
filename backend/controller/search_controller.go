package controller

import (
	"fmt"
	"net/http"
	"sort"
	"strings"

	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/service"
	"github.com/gin-gonic/gin"
)

type SearchController struct {
	userService service.UserService
	albumService service.AlbumService
	playlistService service.PlaylistService
}

func NewSearchController(userService service.UserService,albumService service.AlbumService,playlistService service.PlaylistService) *SearchController {
	return &SearchController{userService: userService, albumService: albumService,playlistService: playlistService}
}

func (sc *SearchController) Search(ctx *gin.Context) {
	query := strings.ToLower(ctx.Query("query"))
	fmt.Println(query) 

	allArtist := sc.userService.FindAllArtist()
	allAlbum := sc.albumService.GetAllAlbum()
	allTrack := sc.albumService.GetAllTrack()
	allPlaylist := sc.playlistService.GetAllPlaylist()

	type SearchModel struct{
		Name string
		Count int
		Distance int
		Contains bool
		Data interface{}
	}

	var combinedData []SearchModel

	for _, artist := range allArtist {
		name := strings.ToLower(artist.Username)
		combinedData = append(combinedData, SearchModel{
			Name: artist.Username,
			Data: artist,
			Count: 0,
			Distance: helper.DamerauLevenshteinDistance(name,query),
			Contains: strings.Contains(name, query),
		})
	}

	for _, album := range allAlbum {
		name := strings.ToLower(album.AlbumName)
		combinedData = append(combinedData, SearchModel{
			Name: album.AlbumName,
			Data: album,
			Count: 0,
			Distance: helper.DamerauLevenshteinDistance(name,query),
			Contains: strings.Contains(name,query),

		})
	}

	for _, track := range allTrack {
		name:= strings.ToLower(track.TrackTitles)
		combinedData = append(combinedData, SearchModel{
			Name: track.TrackTitles,
			Data: track,
			Count: sc.albumService.GetTrackCount(track.TrackID),
			Distance: helper.DamerauLevenshteinDistance(name,query),
			Contains: strings.Contains(name, query),
		})
	}

	for _, playlist := range allPlaylist {
		name := strings.ToLower(playlist.PlaylistTitle)
		combinedData = append(combinedData, SearchModel{
			Name: playlist.PlaylistTitle,
			Data: playlist,
			Count: 0,
			Distance: helper.DamerauLevenshteinDistance(name, query),
			Contains: strings.Contains(name, query),
		})
	}

	sort.Slice(combinedData, func(i, j int) bool {
		if combinedData[i].Contains && !combinedData[j].Contains {
			return true
		}
		if !combinedData[i].Contains && combinedData[j].Contains {
			return false
		}
		if combinedData[i].Contains && combinedData[j].Contains {
			return combinedData[i].Count > combinedData[j].Count
		}

		return combinedData[i].Distance < combinedData[j].Distance
	})
	var filteredCombinedData []interface{}
	for _, value := range combinedData {
		if value.Distance <= 12 || value.Contains {
			filteredCombinedData = append(filteredCombinedData, value.Data)
			}else {
				break
			}
		}
		
	fmt.Println(filteredCombinedData)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   filteredCombinedData,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse.Data)
}
