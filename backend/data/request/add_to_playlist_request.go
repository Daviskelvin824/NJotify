package request

import "time"

type AddToPlaylistRequest struct {
	PlaylistID uint      `validate:"required" json:"playlistid"`
	TrackID    uint      `validate:"required" json:"trackid"`
	DateAdded  time.Time `json:"dateadded"`
}