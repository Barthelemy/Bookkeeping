#ifndef CXX_CLIENT_BOOKKEEPINGCLIENT_H
#define CXX_CLIENT_BOOKKEEPINGCLIENT_H

#include <memory>

class BookkeepingImpl;

class BookkeepingClient {
 public:
  BookkeepingClient(const std::string& url);
  ~BookkeepingClient() = default;

  void updateCounters(
    const std::string &flpName,
    int32_t runNumber,
    int64_t nSubtimeframes,
    int64_t nEquipmentBytes,
    int64_t nRecordingBytes,
    int64_t nFairMQBytes
  );

 private:
  std::shared_ptr<BookkeepingImpl> mImpl;
};

#endif