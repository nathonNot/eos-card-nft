project(card_nft)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( card_nft card_nft card_nft.cpp )
target_include_directories( card_nft PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( card_nft ${CMAKE_SOURCE_DIR}/../ricardian )