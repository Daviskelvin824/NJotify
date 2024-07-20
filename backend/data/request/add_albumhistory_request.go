package request

import "time"

type AlbumHistoryRequest struct {
	AlbumID   uint      `validate:"required" json:"albumid"`
	UserID    uint      `validate:"required" json:"userid"`
	CreatedAt time.Time `json:"createdat"`
}