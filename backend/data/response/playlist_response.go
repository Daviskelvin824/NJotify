package response

type PlaylistResponse struct {
	PlaylistID          uint   `json:"playlistid"`
	CreatorID           uint   `json:"creatorid"`
	PlaylistTitle       string `json:"playlisttitle"`
	PlaylistDescription string `json:"playlistdesc"`
	PlaylistImage       string `json:"playlistimg"`
}