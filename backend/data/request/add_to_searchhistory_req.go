package request

type AddToSearchHistoryRequest struct {
	UserId     uint   `validate:"required" json:"userid"`
	ResultId   uint   `validate:"required" json:"resultid"`
	ResultType string `validate:"required" json:"resulttype"`
}