package response

import "time"

type PlaylistDetailResponse struct {
	PlaylistID uint `json:"playlistid"`
	TrackID    uint `json:"trackid"`
	DateAdded  time.Time `json:"dateadded"`
}