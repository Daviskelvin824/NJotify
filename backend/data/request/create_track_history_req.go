package request

import "time"

type CreateTrackHistoryRequest struct {
	TrackID   uint      `validate:"required" json:"trackid"`
	UserID    uint      `validate:"required" json:"userid"`
	CreatedAt time.Time `json:"createdat"`
}
