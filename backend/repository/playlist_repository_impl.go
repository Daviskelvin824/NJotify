package repository

import (
	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/Daviskelvin824/TPA-Website/model"
	"gorm.io/gorm"
)

type PlaylistRepositoryImpl struct {
	DB *gorm.DB
}

func NewPlaylistRepositoryImpl(DB *gorm.DB) PlaylistRepository{
	return &PlaylistRepositoryImpl{DB:DB}
}

func(c *PlaylistRepositoryImpl) GetAllPlaylist()[]model.Playlist{
	var playlists []model.Playlist
	result:=c.DB.Find(&playlists)
	helper.CheckPanic(result.Error)
	return playlists
}

func (c *PlaylistRepositoryImpl) CreatePlaylist(playlist model.Playlist){
	result := c.DB.Create(&playlist)
	helper.CheckPanic(result.Error)
}

func (c *PlaylistRepositoryImpl) GetUserPlaylist(userId uint) []model.Playlist{
	var playlist []model.Playlist
	result := c.DB.Where("creator_id = ?",userId).Find(&playlist)
	helper.CheckPanic(result.Error)
	return playlist
}

func(c *PlaylistRepositoryImpl) AddToPlaylist(detail model.PlaylistDetail){
	result := c.DB.Create(&detail)
	helper.CheckPanic(result.Error)
}

func(c *PlaylistRepositoryImpl) GetPlaylistDetail(playlistId uint) []model.PlaylistDetail{
	var details []model.PlaylistDetail
	result := c.DB.Where("playlist_id = ?",playlistId).Find(&details)
	helper.CheckPanic(result.Error)
	return details
}

func(c *PlaylistRepositoryImpl) GetPlaylistById(playlistId uint) model.Playlist{
	var playlist model.Playlist
	result := c.DB.Where("playlist_id = ?",playlistId).Find(&playlist)
	helper.CheckPanic(result.Error)
	return playlist
}

func(c *PlaylistRepositoryImpl) DeletePlaylist(playlistId uint){
	var playlist model.Playlist
	result := c.DB.Where("playlist_id = ?",playlistId).Delete(&playlist)
	helper.CheckPanic(result.Error)

	var playlist2 model.PlaylistDetail
	result2 := c.DB.Where("playlist_id = ?",playlistId).Delete(&playlist2)
	helper.CheckPanic(result2.Error)

	var searchHistory model.SearchHistory
    result3 := c.DB.Where("result_id = ? AND result_type = ?", playlistId, "Playlist").Delete(&searchHistory)
    helper.CheckPanic(result3.Error)
}

func (c *PlaylistRepositoryImpl) DeletePlaylistTrack(playlistId uint, trackId uint) {
    var playlistDetail model.PlaylistDetail
    result := c.DB.Where("playlist_id = ? AND track_id = ?", playlistId, trackId).Delete(&playlistDetail)
    if result.Error != nil {
        helper.CheckPanic(result.Error)
    }
}

func(c *PlaylistRepositoryImpl) GetPlaylistDetailByTrackId(trackId uint) model.PlaylistDetail{
	var playlistDetail model.PlaylistDetail
    result := c.DB.Where("track_id = ?", trackId).Find(&playlistDetail)
    if result.Error != nil {
        helper.CheckPanic(result.Error)
    }
	return playlistDetail
}

func(c *PlaylistRepositoryImpl) GetPlaylistPaginated(userId int, pageId int) []model.Playlist{
	var playlists []model.Playlist
	result := c.DB.Where("creator_id = ?",userId).Order("playlist_id ASC").Offset((pageId-1) * 4).Limit(4).Find(&playlists)
	helper.CheckPanic(result.Error)
	return playlists
}

func (c *PlaylistRepositoryImpl)GetPopularTrackByPlaylist(playlistId int)[]model.Track{
	var popularTracks []model.Track
	c.DB.Table("tracks").
		Select("tracks.track_id, tracks.album_id, tracks.track_titles,tracks.file_paths").
		Joins("JOIN playlist_details ON playlist_details.track_id = tracks.track_id").
		Joins("LEFT JOIN track_histories ON tracks.track_id = track_histories.track_id").
		Where("playlist_details.playlist_id = ?", playlistId).
		Group("tracks.track_id, tracks.album_id, tracks.track_titles, tracks.file_paths").
		Order("COUNT(track_histories.track_id) DESC").
		Scan(&popularTracks )

	return popularTracks 
}