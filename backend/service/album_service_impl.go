package service

import (
	"fmt"
	"strconv"
	"time"

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
	RedisService RedisService
}

func NewAlbumServiceImpl(albumRepository repository.AlbumRepository,redisService RedisService, validate *validator.Validate) AlbumService {
	return &AlbumServiceImpl{
		RedisService: redisService,
		AlbumRepository: albumRepository,
		Validate:        validate,
	}
}

func(c *AlbumServiceImpl) GetAllAlbum()[]response.AlbumResponse{
	result := c.AlbumRepository.GetAllAlbum()
	albums := make([]response.AlbumResponse,0)
	for _,value := range result{
		album := response.AlbumResponse{
			AlbumID: value.AlbumID,
			ArtistID: value.ArtistID,
			AlbumName: value.AlbumName,
			CreatedAt: value.CreatedAt,
			ImagePath: value.ImagePath,
			AlbumType: value.AlbumType,
		}
		albums = append(albums, album)
	}
	return albums
}
func(c *AlbumServiceImpl) GetAllTrack()[]response.SingleTrackResponse{
	result := c.AlbumRepository.GetAllTrack()
	tracks := make([]response.SingleTrackResponse,0)
	for _,value := range result{
		track := response.SingleTrackResponse{
			AlbumID: value.AlbumID,
			TrackID: value.TrackID,
			TrackTitles: value.TrackTitles,
			FilePaths: value.FilePaths,
		}
		tracks = append(tracks, track)
	}
	return tracks
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
	artistIdStr := strconv.FormatUint(uint64(responseAlbum.ArtistID), 10)
	albumIdStr := strconv.FormatUint(uint64(responseAlbum.AlbumID),10)
	c.RedisService.ClearKeyFromRedis("album_by_artist:" + artistIdStr)
	c.RedisService.ClearKeyFromRedis("album_by_id:" + albumIdStr)
	c.RedisService.ClearKeyFromRedis("album_track_by_id:" + albumIdStr)
	c.RedisService.ClearKeyFromRedis("popular_track_by_id::" + artistIdStr)
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
		trackIdStr := strconv.FormatUint(uint64(trackModel.TrackID),10)
		c.RedisService.ClearKeyFromRedis("track_by_id:" + trackIdStr)
		c.RedisService.ClearKeyFromRedis("recent_track_by_id:" + trackIdStr)
	}
}

func (c *AlbumServiceImpl) FindAllAlbumByArtist(artistId int) []response.AlbumResponse {
	var albumRedis []response.AlbumResponse
	artistIdStr := strconv.FormatUint(uint64(artistId), 10)
	err:=c.RedisService.GetData("album_by_artist:"+artistIdStr, &albumRedis)
	if(err==nil){
		return albumRedis
	}
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
	err = c.RedisService.SetData("album_by_artist:"+artistIdStr,albums, time.Minute*10)
	fmt.Println(err)
	return albums
}

func (c *AlbumServiceImpl) FindAlbumById(albumId int) response.AlbumResponse {
	var albumRedis response.AlbumResponse
	albumIdStr := strconv.FormatUint(uint64(albumId), 10)
	err:=c.RedisService.GetData("album_by_id:"+albumIdStr, &albumRedis)
	if(err==nil){
		return albumRedis
	}
	result := c.AlbumRepository.GetAlbumById(albumId)
	album := response.AlbumResponse{
		AlbumID:   result.AlbumID,
		ArtistID:  result.ArtistID,
		AlbumName: result.AlbumName,
		CreatedAt: result.CreatedAt,
		ImagePath: result.ImagePath,
		AlbumType: result.AlbumType,
	}
	err = c.RedisService.SetData("album_by_id:"+albumIdStr,album, time.Minute*10)
	fmt.Println(err)
	return album
}

func (c *AlbumServiceImpl) GetTrackByAlbum(albumId int) response.TrackResponse {
	var albumRedis response.TrackResponse
	albumIdStr := strconv.FormatUint(uint64(albumId), 10)
	err:=c.RedisService.GetData("album_track_by_id:"+albumIdStr, &albumRedis)
	if(err==nil){
		return albumRedis
	}
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
	err = c.RedisService.SetData("album_track_by_id:"+albumIdStr,trackResponse, time.Minute*10)
	fmt.Println(err)
	return trackResponse
}

func (c *AlbumServiceImpl) GetTrackByTrackId(trackId int) response.SingleTrackResponse {
	var trackRedis response.SingleTrackResponse
	trackIdStr := strconv.FormatUint(uint64(trackId), 10)
	err:=c.RedisService.GetData("track_by_id:"+trackIdStr, &trackRedis)
	if(err==nil){
		return trackRedis
	}
	tracks := c.AlbumRepository.GetTrackByTrackId(trackId)
	trackResponse := response.SingleTrackResponse{
		AlbumID:     tracks.AlbumID,
		TrackID:     tracks.TrackID,
		TrackTitles: tracks.TrackTitles,
		FilePaths:   tracks.FilePaths,
	}
	err = c.RedisService.SetData("track_by_id:"+trackIdStr,trackResponse, time.Minute*10)
	fmt.Println(err)
	return trackResponse
}

func (c *AlbumServiceImpl) GetPopularTrackByArtist(artistId int) []response.PopularTrackResponse {
	var trackRedis []response.PopularTrackResponse
	trackIdStr := strconv.FormatUint(uint64(artistId), 10)
	err:=c.RedisService.GetData("popular_track_by_id:"+trackIdStr, &trackRedis)
	if(err==nil){
		return trackRedis
	}
	response := c.AlbumRepository.GetPopularTrackByArtist(artistId)
	err = c.RedisService.SetData("popular_track_by_id:"+trackIdStr,response, time.Minute*10)
	fmt.Println(err)
	return response
}
func (c *AlbumServiceImpl) GetPopularTrackByAlbum(albumId int) []response.SingleTrackResponse {
	// var trackRedis []response.PopularTrackResponse
	// trackIdStr := strconv.FormatUint(uint64(artistId), 10)
	// err:=c.RedisService.GetData("popular_track_by_id:"+trackIdStr, &trackRedis)
	// if(err==nil){
	// 	return trackRedis
	// }
	result := c.AlbumRepository.GetPopularTrackByAlbum(albumId)
	trackRes := make([]response.SingleTrackResponse, 0) 
	for _,value := range result{
		track := response.SingleTrackResponse{
			AlbumID: value.AlbumID,
			TrackID: value.TrackID,
			TrackTitles: value.TrackTitles,
			FilePaths: value.FilePaths,
		}
		trackRes = append(trackRes, track)
	}
	// err = c.RedisService.SetData("popular_track_by_id:"+trackIdStr,response, time.Minute*10)
	// fmt.Println(err)
	return trackRes
}

func (c *AlbumServiceImpl) GetMostPlayedTrackByArtist(artistId int) []response.SingleTrackResponse {
	// var trackRedis []response.PopularTrackResponse
	// trackIdStr := strconv.FormatUint(uint64(artistId), 10)
	// err:=c.RedisService.GetData("popular_track_by_id:"+trackIdStr, &trackRedis)
	// if(err==nil){
	// 	return trackRedis
	// }
	result := c.AlbumRepository.GetMostPlayedTrackByArtist(artistId)
	trackRes := make([]response.SingleTrackResponse, 0) 
	for _,value := range result{
		track := response.SingleTrackResponse{
			AlbumID: value.AlbumID,
			TrackID: value.TrackID,
			TrackTitles: value.TrackTitles,
			FilePaths: value.FilePaths,
		}
		trackRes = append(trackRes, track)
	}

	// err = c.RedisService.SetData("popular_track_by_id:"+trackIdStr,response, time.Minute*10)
	// fmt.Println(err)
	return trackRes
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

func (c *AlbumServiceImpl) GetRecentTrack(userId uint) []response.SingleTrackResponse{
	var trackRedis []response.SingleTrackResponse
	trackIdStr := strconv.FormatUint(uint64(userId), 10)
	err:=c.RedisService.GetData("recent_track_by_id:"+trackIdStr, &trackRedis)
	if(err==nil){
		return trackRedis
	}
	result := c.AlbumRepository.GetRecentTrack(userId)
	trackRes := make([]response.SingleTrackResponse, 0) 
	for _, value := range result {
		track:=response.SingleTrackResponse{
			AlbumID: value.AlbumID,
			TrackID: value.TrackID,
			TrackTitles: value.TrackTitles,
			FilePaths: value.FilePaths,
		}
		trackRes = append(trackRes, track)
	}
	err = c.RedisService.SetData("recent_track_by_id:"+trackIdStr,trackRes, time.Minute*10)
	fmt.Println(err)
	return trackRes
}

func (c *AlbumServiceImpl) GetAlbumByAlbumId(albumId uint) response.AlbumResponse{
	value:=c.AlbumRepository.GetAlbumByAlbumId(albumId)
	
	
	album := response.AlbumResponse{
		AlbumID: value.AlbumID,
		ArtistID: value.ArtistID,
		AlbumName: value.AlbumName,
		CreatedAt: value.CreatedAt,
		ImagePath: value.ImagePath,
		AlbumType: value.AlbumType,
	}
	
	
	return album
}

func (c *AlbumServiceImpl) GetAllTrackPaginated(page int) []response.SingleTrackResponse{
	result := c.AlbumRepository.GetAllTrackPaginated(page)
	trackRes := make([]response.SingleTrackResponse, 0) 
	for _,value := range result{
		track := response.SingleTrackResponse{
			AlbumID: value.AlbumID,
			TrackID: value.TrackID,
			TrackTitles: value.TrackTitles,
			FilePaths: value.FilePaths,
		}
		trackRes = append(trackRes, track)
	}
	return trackRes
}

func (c *AlbumServiceImpl) GetAllAlbumPaginated(page int) []response.AlbumResponse{
	result := c.AlbumRepository.GetAllAlbumPaginated(page)
	albumRes := make([]response.AlbumResponse, 0)
	for _,value := range result{
		album := response.AlbumResponse{
			AlbumID: value.AlbumID,
			ArtistID: value.ArtistID,
			AlbumName: value.AlbumName,
			CreatedAt: value.CreatedAt,
			ImagePath: value.ImagePath,
			AlbumType: value.AlbumType,
		}
		albumRes = append(albumRes, album)
	}
	return albumRes
}

func (c *AlbumServiceImpl) GetAllRecentAlbumPaginated(userId int,page int) []response.AlbumResponse{
	result := c.AlbumRepository.GetAllRecentAlbumPaginated(userId,page)
	albumRes := make([]response.AlbumResponse, 0)
	for _,value := range result{
		album := response.AlbumResponse{
			AlbumID: value.AlbumID,
			ArtistID: value.ArtistID,
			AlbumName: value.AlbumName,
			CreatedAt: value.CreatedAt,
			ImagePath: value.ImagePath,
			AlbumType: value.AlbumType,
		}
		albumRes = append(albumRes, album)
	}
	return albumRes
}

func(c *AlbumServiceImpl) GetTrackCount(trackId uint) int{
	count := c.AlbumRepository.GetTrackCount(trackId)
	return count
}