package response

type PopularTrackResponse struct {
	AlbumID        uint   `json:"albumid"`
	TrackID        uint   `json:"trackid"`
	ImagePath      string `json:"imagepath"`
	TrackTitles    string `json:"tracktitles"`
	FilePaths      string `json:"filepaths"`
	ListeningCount uint   `json:"listenercount"`
}
