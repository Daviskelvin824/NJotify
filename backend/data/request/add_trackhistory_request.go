package request

import "time"

type AddTrackHistoryRequest struct {
	TrackID   uint `validate:"required" json:"trackid"`
	UserID    uint `validate:"required" json:"userid"`
	CreatedAt time.Time `json:"createdat"`
}