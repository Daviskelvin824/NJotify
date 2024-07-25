package repository

import "github.com/Daviskelvin824/TPA-Website/model"

type PlaylistRepository interface {
	GetAllPlaylist()[]model.Playlist
	CreatePlaylist(playlist model.Playlist) 
	GetUserPlaylist(userid uint) []model.Playlist
	AddToPlaylist(detail model.PlaylistDetail)
	GetPlaylistDetail(playlistId uint) []model.PlaylistDetail
	GetPlaylistById(playlistId uint) model.Playlist
	DeletePlaylist(playlistId uint)
	DeletePlaylistTrack(playlistId uint,trackId uint)
	GetPlaylistDetailByTrackId(trackId uint) model.PlaylistDetail
	GetPlaylistPaginated(userId int, pageId int) []model.Playlist
}