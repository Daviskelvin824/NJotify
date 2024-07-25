package service

import (
	"fmt"
	"strconv"
	"time"

	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/model"
	"github.com/Daviskelvin824/TPA-Website/repository"
	"github.com/go-playground/validator"
)

type PlaylistServiceImpl struct {
	PlaylistRepository repository.PlaylistRepository
	Validate *validator.Validate
	RedisService RedisService
}

func NewPlaylistServiceImpl(playlistrepo repository.PlaylistRepository, redisService RedisService, validate *validator.Validate) PlaylistService{
	return &PlaylistServiceImpl{
		RedisService: redisService,
		PlaylistRepository: playlistrepo,
		Validate: validate,
	}
}

func(c *PlaylistServiceImpl) GetAllPlaylist()[]response.PlaylistResponse{
	result := c.PlaylistRepository.GetAllPlaylist();
	playlists := make([]response.PlaylistResponse,0)
	for _,value := range result{
		playlist := response.PlaylistResponse{
			PlaylistID: value.PlaylistID,
			CreatorID: value.CreatorID,
			PlaylistTitle: value.PlaylistTitle,
			PlaylistDescription: value.PlaylistDescription,
			PlaylistImage: value.PlaylistImage,
		}
		playlists = append(playlists, playlist)
	}
	return playlists
}

func (c *PlaylistServiceImpl) CreatePlaylist(playlist request.CreatePlaylistRequest){
	err := c.Validate.Struct(playlist)
	helper.CheckPanic(err)
	playlistModel := model.Playlist{
		CreatorID: playlist.CreatorID,
		PlaylistTitle: playlist.PlaylistTitle,
		PlaylistDescription: playlist.PlaylistDescription,
		PlaylistImage: playlist.PlaylistImage,
	}
	c.PlaylistRepository.CreatePlaylist(playlistModel)
	c.RedisService.FlushDB()
}

func (c *PlaylistServiceImpl) GetUserPlaylist(userid uint) []response.PlaylistResponse{
	result := c.PlaylistRepository.GetUserPlaylist(userid)
	var playlists []response.PlaylistResponse
	for _, value := range result{
		playlist := response.PlaylistResponse{
			PlaylistID: value.PlaylistID,
			CreatorID: value.CreatorID,
			PlaylistTitle: value.PlaylistTitle,
			PlaylistDescription: value.PlaylistDescription,
			PlaylistImage: value.PlaylistImage,
		}
		playlists = append(playlists,playlist)
	}
	return playlists
}

func (c *PlaylistServiceImpl) AddToPlaylist(req request.AddToPlaylistRequest){
	err := c.Validate.Struct(req)
	helper.CheckPanic(err)

	detailModel := model.PlaylistDetail{
		PlaylistID: req.PlaylistID,
		TrackID: req.TrackID,
		DateAdded: req.DateAdded,
	}

	c.PlaylistRepository.AddToPlaylist(detailModel)
	c.RedisService.FlushDB()
}

func (c *PlaylistServiceImpl) GetPlaylistDetail(playlistId uint) []response.PlaylistDetailResponse{
	var playlistRedis []response.PlaylistDetailResponse
	playlistIdStr := strconv.FormatUint(uint64(playlistId), 10)
	err:=c.RedisService.GetData("playlist_detail_by_id:"+playlistIdStr, &playlistRedis)
	if(err==nil){
		return playlistRedis
	}
	result := c.PlaylistRepository.GetPlaylistDetail(playlistId)
	detailResponses := make([]response.PlaylistDetailResponse, 0) 
	for _,value := range result{
		detail := response.PlaylistDetailResponse{
			PlaylistID: value.PlaylistID,
			TrackID: value.TrackID,
			DateAdded: value.DateAdded,
		}
		detailResponses = append(detailResponses,detail)
	}
	err = c.RedisService.SetData("playlist_detail_by_id:"+playlistIdStr,detailResponses, time.Minute*10)
	fmt.Println(err)
	return detailResponses
}

func(c *PlaylistServiceImpl) GetPlaylistById(playlistId uint) response.PlaylistResponse{
	var playlistRedis response.PlaylistResponse
	playlistIdStr := strconv.FormatUint(uint64(playlistId), 10)
	err:=c.RedisService.GetData("playlist_by_id:"+playlistIdStr, &playlistRedis)
	if(err==nil){
		return playlistRedis
	}
	result := c.PlaylistRepository.GetPlaylistById(playlistId)
	playlistRes := response.PlaylistResponse{
		PlaylistID: result.PlaylistID,
		CreatorID: result.CreatorID,
		PlaylistTitle: result.PlaylistTitle,
		PlaylistDescription: result.PlaylistDescription,
		PlaylistImage: result.PlaylistImage,
	}
	err = c.RedisService.SetData("playlist_by_id:"+playlistIdStr,playlistRes, time.Minute*10)
	fmt.Println(err)
	return playlistRes
}

func(c *PlaylistServiceImpl) DeletePlaylist(playlistId uint){
	playlistIdStr := strconv.FormatUint(uint64(playlistId), 10)
	c.PlaylistRepository.DeletePlaylist(playlistId)
	c.RedisService.ClearKeyFromRedis("playlist_by_id:" + playlistIdStr)
	c.RedisService.ClearKeyFromRedis("playlist_detail_by_id:" + playlistIdStr)
}
func(c *PlaylistServiceImpl) DeletePlaylistTrack(playlistId uint,trackId uint){
	playlistIdStr := strconv.FormatUint(uint64(playlistId), 10)
	trackIdStr := strconv.FormatUint(uint64(trackId), 10)
	c.PlaylistRepository.DeletePlaylistTrack(playlistId,trackId)
	c.RedisService.ClearKeyFromRedis("playlist_by_id:" + playlistIdStr)
	c.RedisService.ClearKeyFromRedis("playlist_detail_by_id:" + playlistIdStr)
	c.RedisService.ClearKeyFromRedis("playlist_track_by_id:" + trackIdStr)
}

func(c *PlaylistServiceImpl) GetPlaylistDetailByTrackId(trackId uint) response.PlaylistDetailResponse{
	var playlistRedis response.PlaylistDetailResponse
	fmt.Println("ada di playlist track ni")
	trackIdStr := strconv.FormatUint(uint64(trackId), 10)
	err:=c.RedisService.GetData("playlist_track_by_id:"+trackIdStr, &playlistRedis)
	if(err==nil){
		return playlistRedis
	}
	result := c.PlaylistRepository.GetPlaylistDetailByTrackId(trackId)
	detailRes := response.PlaylistDetailResponse{
		PlaylistID: result.PlaylistID,
		TrackID: result.TrackID,
		DateAdded: result.DateAdded,
	}
	err = c.RedisService.SetData("playlist_track_by_id:"+trackIdStr,detailRes, time.Minute*10)
	fmt.Println(err)
	return detailRes
}

func (c *PlaylistServiceImpl) GetPlaylistPaginated(userId int, pageId int) []response.PlaylistResponse{
	result := c.PlaylistRepository.GetPlaylistPaginated(userId,pageId)
	playlistRes := make([]response.PlaylistResponse,0)
	for _,value := range result{
		playlist := response.PlaylistResponse{
			PlaylistID: value.PlaylistID,
			CreatorID: value.CreatorID,
			PlaylistTitle: value.PlaylistTitle,
			PlaylistDescription: value.PlaylistDescription,
			PlaylistImage: value.PlaylistImage,
		}
		playlistRes = append(playlistRes, playlist)
	}
	return playlistRes
}