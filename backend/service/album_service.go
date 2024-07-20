package service

import (
	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
)

type AlbumService interface {
	CreateAlbum(albums request.CreateAlbumRequest) response.AlbumResponse
	CreateTrack(tracks request.CreateTrackRequest)
	FindAllAlbumByArtist(artistId int) []response.AlbumResponse
	FindAlbumById(albumId int) response.AlbumResponse
	GetTrackByAlbum(albumId int) response.TrackResponse
	GetTrackByTrackId(trackId int) response.SingleTrackResponse
	GetPopularTrackByArtist(artistId int) []response.PopularTrackResponse
	AddTrackHistory(history request.AddTrackHistoryRequest)
	AddAlbumHistory(history request.AlbumHistoryRequest)
}
