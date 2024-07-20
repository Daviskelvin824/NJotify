package request

type DeletePlaylistTrackReq struct {
	PlaylistId uint `json:"playlistid"`
	TrackId    uint `json:"trackid"`
}