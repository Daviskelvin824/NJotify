package response

type TrackResponse struct {
	AlbumID     uint     `json:"albumid"`
	TrackID     []uint   `json:"trackid"`
	TrackTitles []string `json:"tracktitles"`
	FilePaths   []string `json:"filepaths"`
}
