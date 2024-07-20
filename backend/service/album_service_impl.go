package service

import (
	"github.com/Daviskelvin824/TPA-Website/data/request"
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/model"
	"github.com/Daviskelvin824/TPA-Website/repository"
	"github.com/go-playground/validator"
)

type AlbumServiceImpl struct {
	AlbumRepository repository.AlbumRepository
	Validate        *validator.Validate
}

func NewAlbumServiceImpl(albumRepository repository.AlbumRepository, validate *validator.Validate) AlbumService {
	return &AlbumServiceImpl{
		AlbumRepository: albumRepository,
		Validate:        validate,
	}
}

func (c *AlbumServiceImpl) CreateAlbum(albums request.CreateAlbumRequest) response.AlbumResponse {
	err := c.Validate.Struct(albums)
	helper.CheckPanic(err)
	albumModel := model.Album{
		ArtistID:  albums.ArtistID,
		AlbumName: albums.AlbumName,
		CreatedAt: albums.CreatedAt,
		ImagePath: albums.ImagePath,
		AlbumType: albums.AlbumType,
	}
	insertedAlbum := c.AlbumRepository.CreateAlbum(albumModel)

	responseAlbum := response.AlbumResponse{
		AlbumID:   insertedAlbum.AlbumID,
		ArtistID:  insertedAlbum.ArtistID,
		AlbumName: insertedAlbum.AlbumName,
		CreatedAt: insertedAlbum.CreatedAt,
		ImagePath: insertedAlbum.ImagePath,
		AlbumType: insertedAlbum.AlbumType,
	}
	return responseAlbum
}

func (c *AlbumServiceImpl) CreateTrack(tracks request.CreateTrackRequest) {
	err := c.Validate.Struct(tracks)
	helper.CheckPanic(err)
	for i := range tracks.TrackTitles {
		trackModel := model.Track{
			AlbumID:     tracks.AlbumID,
			TrackTitles: tracks.TrackTitles[i],
			FilePaths:   tracks.FilePaths[i],
		}
		c.AlbumRepository.CreateTrack(trackModel)
	}
}

func (c *AlbumServiceImpl) FindAllAlbumByArtist(artistId int) []response.AlbumResponse {
	result := c.AlbumRepository.GetAllAlbumByArtist(artistId)
	var albums []response.AlbumResponse
	for _, value := range result {
		album := response.AlbumResponse{
			AlbumID:   value.AlbumID,
			AlbumName: value.AlbumName,
			ArtistID:  value.ArtistID,
			CreatedAt: value.CreatedAt,
			ImagePath: value.ImagePath,
			AlbumType: value.AlbumType,
		}
		albums = append(albums, album)
	}
	return albums
}

func (c *AlbumServiceImpl) FindAlbumById(albumId int) response.AlbumResponse {
	result := c.AlbumRepository.GetAlbumById(albumId)
	album := response.AlbumResponse{
		AlbumID:   result.AlbumID,
		ArtistID:  result.ArtistID,
		AlbumName: result.AlbumName,
		CreatedAt: result.CreatedAt,
		ImagePath: result.ImagePath,
		AlbumType: result.AlbumType,
	}
	return album
}

func (c *AlbumServiceImpl) GetTrackByAlbum(albumId int) response.TrackResponse {
	tracks := c.AlbumRepository.GetTrackByAlbum(albumId)

	trackTitles := make([]string, len(tracks))
	filePaths := make([]string, len(tracks))
	trackIdList := make([]uint, len(tracks))

	for i, track := range tracks {
		trackIdList[i] = track.TrackID
		trackTitles[i] = track.TrackTitles
		filePaths[i] = track.FilePaths
	}

	trackResponse := response.TrackResponse{
		AlbumID:     uint(albumId),
		TrackID:     trackIdList,
		TrackTitles: trackTitles,
		FilePaths:   filePaths,
	}
	return trackResponse
}

func (c *AlbumServiceImpl) GetTrackByTrackId(trackId int) response.SingleTrackResponse {
	tracks := c.AlbumRepository.GetTrackByTrackId(trackId)

	trackResponse := response.SingleTrackResponse{
		AlbumID:     tracks.AlbumID,
		TrackID:     tracks.TrackID,
		TrackTitles: tracks.TrackTitles,
		FilePaths:   tracks.FilePaths,
	}
	return trackResponse
}

func (c *AlbumServiceImpl) GetPopularTrackByArtist(artistId int) []response.PopularTrackResponse {
	response := c.AlbumRepository.GetPopularTrackByArtist(artistId)
	return response
}

func(c *AlbumServiceImpl) AddTrackHistory(history request.AddTrackHistoryRequest){
	err := c.Validate.Struct(history)
	helper.CheckPanic(err)

	historyModel := model.TrackHistory{
		TrackID: history.TrackID,
		UserID: history.UserID,
		CreatedAt: history.CreatedAt,
	}
	c.AlbumRepository.AddTrackHistory(historyModel)
}	
func(c *AlbumServiceImpl) AddAlbumHistory(history request.AlbumHistoryRequest){
	err := c.Validate.Struct(history)
	helper.CheckPanic(err)

	historyModel := model.AlbumHistory{
		AlbumID: history.AlbumID,
		UserID: history.UserID,
		CreatedAt: history.CreatedAt,
	}
	c.AlbumRepository.AddAlbumHistory(historyModel)
}	
