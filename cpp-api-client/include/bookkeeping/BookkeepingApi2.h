#pragma once

#include <string>

namespace o2::bookkeeping
{

class BookkeepingApi2
{
public:



  void connect();
  void disconnect();

  /**
     * @brief Update flp by id
     *
     * @param flpId Integer ID of a specific data taking session.
     * @param runNumber Integer ID of a specific data taking session
     * @param nSubtimeframes Number of subtimeframes processed in this FLP. Updated regularly.
     * @param nEquipmentBytes Data volume out from the readout 'equipment' component in bytes. Can reach PetaBytes. Updated regularly.
     * @param nRecordingBytes Data volume out from the readout 'recording' component in bytes. Can reach PetaBytes. Updated regularly.
     * @param nFairMqBytes Data volume out from the readout 'fmq' component in bytes. Can reach PetaBytes. Updated regularly.
     * @throws org::openapitools::client::api::ApiException
   */
  void flpUpdateCounters(std::string flpName, int64_t runNumber, int64_t nSubtimeframes, int64_t nEquipmentBytes,
                                 int64_t nRecordingBytes, int64_t nFairMQBytes);

private:
  std::string mUrl;
  std::string mToken;

};


}
