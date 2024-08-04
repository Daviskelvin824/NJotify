package repository

import (
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/model"
)

type AlbumRepository interface {
	GetAllAlbum()[]model.Album
	GetAllTrack()[]model.Track
	CreateAlbum(album model.Album) model.Album
	CreateTrack(track model.Track)
	GetAllAlbumByArtist(artistId int) []model.Album
	GetAlbumById(albumId int) model.Album
	GetTrackByAlbum(albumId int) []model.Track
	GetTrackByTrackId(trackId int) model.Track
	GetPopularTrackByArtist(artistId int) []response.PopularTrackResponse
	GetPopularTrackByAlbum(albumId int) []model.Track
	GetMostPlayedTrackByArtist(artistId int) []model.Track
	AddTrackHistory (history model.TrackHistory)
	AddAlbumHistory (history model.AlbumHistory)
	GetRecentTrack(userId uint) []model.Track
	GetAlbumByAlbumId(albumId uint) model.Album
	GetAllTrackPaginated(page int) []model.Track
	GetAllAlbumPaginated(page int) []model.Album
	GetAllRecentAlbumPaginated(userId int,page int) []model.Album
	GetTrackCount(trackId uint) int
}
