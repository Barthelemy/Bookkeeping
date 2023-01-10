#include "BookkeepingApi/BookkeepingClient.h"
#include <iostream>
#include <grpc++/grpc++.h>
#include "flp.grpc.pb.h"
#include "BookkeepingImpl.h"

BookkeepingClient::BookkeepingClient(const std::string& url)
{
  mImpl = std::make_shared<BookkeepingImpl>(url);
}

void BookkeepingClient::updateCounters(
  const std::string &flpName,
  int32_t runNumber,
  int64_t nSubtimeframes,
  int64_t nEquipmentBytes,
  int64_t nRecordingBytes,
  int64_t nFairMQBytes
)
{
  mImpl->updateCounters(flpName, runNumber, nSubtimeframes, nEquipmentBytes, nRecordingBytes, nFairMQBytes);
}