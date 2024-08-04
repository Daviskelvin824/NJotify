package response

type SearchHistoryResponse struct {
	SearchHistoryId uint   `validate:"required" json:"searchhistoryid"`
	UserId          uint   `validate:"required" json:"userid"`
	ResultId        uint   `validate:"required" json:"resultid"`
	ResultType      string `validate:"required" json:"resulttype"`
}