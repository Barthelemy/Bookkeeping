#include <iostream>
#include "BookkeepingApi/BookkeepingClient.h"

int main() {
    BookkeepingClient client("127.0.0.1:4001");

    client.updateCounters("FLP-TPC-1", 1, 100, 100, 100, 100);

    return 0;
}
