package repository

import (
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/model"
)

type AlbumRepository interface {
	CreateAlbum(album model.Album) model.Album
	CreateTrack(track model.Track)
	GetAllAlbumByArtist(artistId int) []model.Album
	GetAlbumById(albumId int) model.Album
	GetTrackByAlbum(albumId int) []model.Track
	GetTrackByTrackId(trackId int) model.Track
	GetPopularTrackByArtist(artistId int) []response.PopularTrackResponse
	AddTrackHistory (history model.TrackHistory)
	AddAlbumHistory (history model.AlbumHistory)
}
