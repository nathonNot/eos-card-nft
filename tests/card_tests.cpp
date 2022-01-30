#include <boost/test/unit_test.hpp>
#include <eosio/chain/abi_serializer.hpp>
#include <eosio/chain/permission_object.hpp>
#include <eosio/chain/resource_limits.hpp>
#include <eosio/testing/tester.hpp>

using namespace eosio;
using namespace eosio::chain;
using namespace eosio::testing;
using namespace fc;

BOOST_AUTO_TEST_SUITE(card_tests)

BOOST_AUTO_TEST_CASE(create) try {
    tester t{setup_policy::none};

    // Load contract
    t.create_account(N(card));
    t.set_code(N(card), read_wasm("card_nft.wasm"));
    t.set_abi(N(card), read_abi("card_nft.abi").data());
    t.produce_block();

    // Create users
    t.create_account(N(john));
    t.create_account(N(jane));

    // Test "create" action
    t.push_action(
        N(card), N(create), N(card),
        mutable_variant_object //
        ("issuer", "card")              //
        ("symbol", "NFTCARD")        //
    );
    
    BOOST_CHECK_THROW(
    [&] {
        t.push_action(
            N(card), N(create), N(card),
            mutable_variant_object       //
            ("issuer", "card")                    //
            ("symbol", "NFTCARD")             //
        );
    }(),
    fc::exception);

    vector<string> uris = {"adasdsad","asdasdasd"};
    t.push_action(
        N(card), N(issue), N(card),
        mutable_variant_object
        ("to", "card")       
        ("quantity", "2 NFTCARD")
        ("uris", uris) 
        ("tkn_name", "青眼白龙") 
        ("memo", "qwe") 
        ("tkn_data", "star") 
    );
    // Can't reply to non-existing message

    BOOST_CHECK_THROW(
        [&] {
            t.push_action(
                N(card), N(issue), N(card),
                mutable_variant_object       //
                ("to", "card")       
                ("quantity", "1 NFTCARD")
                ("uris", uris) 
                ("tkn_name", "青眼白龙") 
                ("memo", "qwee")          //
                ("tkn_data", "star") 
            );
        }(),
        fc::exception);
}

FC_LOG_AND_RETHROW()

BOOST_AUTO_TEST_SUITE_END()
