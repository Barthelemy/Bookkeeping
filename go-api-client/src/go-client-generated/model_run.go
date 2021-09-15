/*
 * ALICE Bookkeeping
 *
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * API version: 0.0.0
 * Generated by: Swagger Codegen (https://github.com/swagger-api/swagger-codegen.git)
 */
package swagger
import (
	"time"
)

// Describes an intervention or an event that happened.
type Run struct {
	ActivityId string `json:"activityId,omitempty"`
	BytesReadOut int32 `json:"bytesReadOut,omitempty"`
	// Unix timestamp when this entity was created.
	CreatedAt int32 `json:"createdAt,omitempty"`
	Id int32 `json:"id,omitempty"`
	NDetectors int32 `json:"nDetectors,omitempty"`
	NEpns int32 `json:"nEpns,omitempty"`
	NFlps int32 `json:"nFlps,omitempty"`
	NSubtimeframes int32 `json:"nSubtimeframes,omitempty"`
	RunNumber int32 `json:"runNumber,omitempty"`
	RunQuality *RunQuality `json:"runQuality,omitempty"`
	RunType *RunType `json:"runType,omitempty"`
	TimeO2End *time.Time `json:"timeO2End,omitempty"`
	TimeO2Start *time.Time `json:"timeO2Start,omitempty"`
	TimeTrgEnd *time.Time `json:"timeTrgEnd,omitempty"`
	TimeTrgStart *time.Time `json:"timeTrgStart,omitempty"`
	DdFlp bool `json:"dd_flp,omitempty"`
	Dcs bool `json:"dcs,omitempty"`
	Epn bool `json:"epn,omitempty"`
	// Unix timestamp when this entity was last updated.
	UpdatedAt int32 `json:"updatedAt,omitempty"`
}
