package repository

import (
	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/model"
	"gorm.io/gorm"
)

type AlbumRepositoryImpl struct {
	Db *gorm.DB
}

func NewAlbumRepositoryImpl(Db *gorm.DB) AlbumRepository {
	return &AlbumRepositoryImpl{Db: Db}
}

func (c *AlbumRepositoryImpl) CreateAlbum(album model.Album) model.Album {
	result := c.Db.Create(&album)
	helper.CheckPanic(result.Error)
	return album
}

func (c *AlbumRepositoryImpl) CreateTrack(track model.Track) {
	result := c.Db.Create(&track)
	helper.CheckPanic(result.Error)
}

func (c *AlbumRepositoryImpl) GetAllAlbumByArtist(artistId int) []model.Album {
	var albums []model.Album
	result := c.Db.Where("artist_id = ?", artistId).Find(&albums)
	helper.CheckPanic(result.Error)
	return albums
}

func (c *AlbumRepositoryImpl) GetAlbumById(albumId int) model.Album {
	var albums model.Album
	result := c.Db.Where("album_id = ?", albumId).Find(&albums)
	helper.CheckPanic(result.Error)
	return albums
}

func (c *AlbumRepositoryImpl) GetTrackByAlbum(albumId int) []model.Track {
	var tracks []model.Track
	result := c.Db.Where("album_id = ?", albumId).Find(&tracks)
	helper.CheckPanic(result.Error)
	return tracks
}

func (c *AlbumRepositoryImpl) GetTrackByTrackId(trackId int) model.Track {
	var tracks model.Track
	result := c.Db.Where("track_id = ?", trackId).Find(&tracks)
	helper.CheckPanic(result.Error)
	return tracks
}

func (c *AlbumRepositoryImpl) GetPopularTrackByArtist(artistId int) []response.PopularTrackResponse {
	var popularTracks []response.PopularTrackResponse

	c.Db.Table("tracks").
		Select("tracks.album_id, tracks.track_id, albums.image_path, tracks.track_titles,tracks.file_paths ,COALESCE(COUNT(track_histories.track_id), 0) as listening_count").
		Joins("JOIN albums ON albums.album_id = tracks.album_id").
		Joins("LEFT JOIN track_histories ON tracks.track_id = track_histories.track_id").
		Where("albums.artist_id = ?", artistId).
		Group("tracks.track_id, tracks.album_id, albums.image_path, tracks.track_titles, tracks.file_paths").
		Order("listening_count DESC").
		Scan(&popularTracks)

	return popularTracks
}

func(c *AlbumRepositoryImpl) AddTrackHistory(history model.TrackHistory){
	result := c.Db.Create(&history)
	helper.CheckPanic(result.Error)
}

func(c *AlbumRepositoryImpl) AddAlbumHistory(history model.AlbumHistory){
	result := c.Db.Create(&history)
	helper.CheckPanic(result.Error)
}