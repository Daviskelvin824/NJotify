package request

type CreatePlaylistRequest struct {
	CreatorID           uint   `validate:"required" json:"creatorid"`
	PlaylistTitle       string `validate:"required" json:"playlisttitle"`
	PlaylistDescription string `validate:"required" json:"playlistdesc"`
	PlaylistImage       string `validate:"required" json:"playlistimg"`
}