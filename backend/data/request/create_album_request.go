package request

import "time"

type CreateAlbumRequest struct {
	ArtistID  uint      `validate:"required" json:"artistid"`
	AlbumName string    `validate:"required" json:"albumname"`
	CreatedAt time.Time `json:"createdat"`
	ImagePath string    `validate:"required" json:"imagepath"`
	AlbumType string    `validate:"required" json:"albumtype"`
}
