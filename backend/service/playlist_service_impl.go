package service

import (
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
}

func NewPlaylistServiceImpl(playlistrepo repository.PlaylistRepository, validate *validator.Validate) PlaylistService{
	return &PlaylistServiceImpl{
		PlaylistRepository: playlistrepo,
		Validate: validate,
	}
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
}

func (c *PlaylistServiceImpl) GetPlaylistDetail(playlistId uint) []response.PlaylistDetailResponse{
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

	return detailResponses
}

func(c *PlaylistServiceImpl) GetPlaylistById(playlistId uint) response.PlaylistResponse{
	result := c.PlaylistRepository.GetPlaylistById(playlistId)
	playlistRes := response.PlaylistResponse{
		PlaylistID: result.PlaylistID,
		CreatorID: result.CreatorID,
		PlaylistTitle: result.PlaylistTitle,
		PlaylistDescription: result.PlaylistDescription,
		PlaylistImage: result.PlaylistImage,
	}
	return playlistRes
}

func(c *PlaylistServiceImpl) DeletePlaylist(playlistId uint){
	c.PlaylistRepository.DeletePlaylist(playlistId)
}
func(c *PlaylistServiceImpl) DeletePlaylistTrack(playlistId uint,trackId uint){
	c.PlaylistRepository.DeletePlaylistTrack(playlistId,trackId)
}

func(c *PlaylistServiceImpl) GetPlaylistDetailByTrackId(trackId uint) response.PlaylistDetailResponse{
	result := c.PlaylistRepository.GetPlaylistDetailByTrackId(trackId)
	detailRes := response.PlaylistDetailResponse{
		PlaylistID: result.PlaylistID,
		TrackID: result.TrackID,
		DateAdded: result.DateAdded,
	}
	return detailRes
}