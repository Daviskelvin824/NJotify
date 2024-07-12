package response

import "time"

type AlbumResponse struct {
	AlbumID   uint      `json:"albumid"`
	ArtistID  uint      `json:"artistid"`
	AlbumName string    `json:"albumname"`
	CreatedAt time.Time `json:"createdat"`
	ImagePath string    `json:"imagepath"`
	AlbumType string    `json:"albumtype"`
}
