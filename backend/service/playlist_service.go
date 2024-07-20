package service

import (
	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
)

type PlaylistService interface {
	CreatePlaylist(playlist request.CreatePlaylistRequest)
	GetUserPlaylist(userid uint) []response.PlaylistResponse
	AddToPlaylist(req request.AddToPlaylistRequest)
	GetPlaylistDetail(playlistId uint) []response.PlaylistDetailResponse
	GetPlaylistById(playlistId uint) response.PlaylistResponse
	DeletePlaylist(playlistId uint)
	DeletePlaylistTrack(playlistId uint,trackId uint)
	GetPlaylistDetailByTrackId(trackId uint) response.PlaylistDetailResponse
}