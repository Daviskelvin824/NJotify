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

func (c *AlbumRepositoryImpl) GetAllAlbum() []model.Album{
	var albums []model.Album
	result:=c.Db.Find(&albums)
	helper.CheckPanic(result.Error)
	return albums
}
func (c *AlbumRepositoryImpl) GetAllTrack() []model.Track{
	var tracks []model.Track
	result:=c.Db.Find(&tracks)
	helper.CheckPanic(result.Error)
	return tracks
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

func (c *AlbumRepositoryImpl) GetPopularTrackByAlbum(albumId int) []model.Track {
	var popularTracks []model.Track

	c.Db.Table("tracks").
		Select("tracks.track_id, tracks.album_id, tracks.track_titles,tracks.file_paths").
		Joins("JOIN albums ON albums.album_id = tracks.album_id").
		Joins("LEFT JOIN track_histories ON tracks.track_id = track_histories.track_id").
		Where("albums.album_id = ?", albumId).
		Group("tracks.track_id, tracks.album_id, albums.image_path, tracks.track_titles, tracks.file_paths").
		Order("COUNT(track_histories.track_id) DESC").
		Scan(&popularTracks)

	return popularTracks
}

func (c *AlbumRepositoryImpl) GetMostPlayedTrackByArtist(artistId int) []model.Track {
	var mostPlayedTracks  []model.Track

	c.Db.Table("tracks").
		Select("tracks.track_id, tracks.album_id, tracks.track_titles,tracks.file_paths").
		Joins("JOIN albums ON albums.album_id = tracks.album_id").
		Joins("LEFT JOIN track_histories ON tracks.track_id = track_histories.track_id").
		Where("albums.artist_id = ?", artistId).
		Group("tracks.track_id, tracks.album_id, tracks.track_titles, tracks.file_paths").
		Order("COUNT(track_histories.track_id) DESC").
		Scan(&mostPlayedTracks )

	return mostPlayedTracks 
}

func(c *AlbumRepositoryImpl) AddTrackHistory(history model.TrackHistory){
	result := c.Db.Create(&history)
	helper.CheckPanic(result.Error)
}

func(c *AlbumRepositoryImpl) AddAlbumHistory(history model.AlbumHistory){
	result := c.Db.Create(&history)
	helper.CheckPanic(result.Error)
}

func (c *AlbumRepositoryImpl) GetRecentTrack(userId uint) []model.Track {
    var recentTracks []model.Track
    result := c.Db.Table("track_histories").
        Select("tracks.*").
        Joins("JOIN tracks ON tracks.track_id = track_histories.track_id").
        Where("track_histories.user_id = ?", userId).
        Group("tracks.track_id").
        Order("MAX(track_histories.created_at) DESC").
        Find(&recentTracks)
    helper.CheckPanic(result.Error)
    return recentTracks
}

func (c *AlbumRepositoryImpl) GetAlbumByAlbumId(albumId uint) model.Album{
	var albums model.Album
	result := c.Db.Where("album_id = ?",albumId).First(&albums)
	helper.CheckPanic(result.Error)
	return albums
}

func (c *AlbumRepositoryImpl) GetAllTrackPaginated(page int) []model.Track {
	var tracks []model.Track
	result := c.Db.Order("track_id ASC").Offset((page-1) * 4).Limit(4).Find(&tracks)
	helper.CheckPanic(result.Error)
	return tracks
}

func (c *AlbumRepositoryImpl) GetAllAlbumPaginated(page int) []model.Album {
	var albums []model.Album
	result := c.Db.Order("album_id ASC").Offset((page-1) * 4).Limit(4).Find(&albums)
	helper.CheckPanic(result.Error)
	return albums
}

func (c *AlbumRepositoryImpl) GetAllRecentAlbumPaginated(userId int,page int) []model.Album {
	var albums []model.Album
	result := c.Db.Table("album_histories").Select("albums.*").Joins("JOIN albums ON albums.album_id = album_histories.album_id").
	Where("album_histories.user_id = ?", userId).
	Group("albums.album_id").
	Order("MAX(album_histories.created_at) DESC").Offset((page-1) * 4).Limit(4).
	Find(&albums)
	helper.CheckPanic(result.Error)
	return albums
}

func (c *AlbumRepositoryImpl) GetTrackCount(trackId uint) int{
	var count int64

	result := c.Db.Table("track_histories").
		Select("COUNT(*)").
		Where("track_id = ?", trackId).
		Count(&count)
	
	if result.Error != nil {
		helper.CheckPanic(result.Error)
	}

	return int(count)
}