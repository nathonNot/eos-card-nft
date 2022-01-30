#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>
#include <eosio/print.hpp>

using namespace eosio;
using std::string;
using std::vector;

struct [[eosio::table("account"), eosio::contract("card_nft")]] account {
    asset    balance;
    uint64_t primary_key() const { return balance.symbol.code().raw(); }
};
using account_index = eosio::multi_index<"accounts"_n, account>;

struct [[eosio::table("stats"), eosio::contract("card_nft")]] stats {
    asset    supply;
    name     issuer;
    uint64_t primary_key() const { return supply.symbol.code().raw(); }
    uint64_t get_issuer() const { return issuer.value; }
};
using currency_index = eosio::multi_index<"stat"_n, stats, indexed_by<"byissuer"_n, const_mem_fun<stats, uint64_t, &stats::get_issuer>>>;

struct [[eosio::table("token"), eosio::contract("card_nft")]] token {
    uint64_t id;        // Unique 64 bit identifier,
    string   uri;       // RFC 3986
    name     owner;     // token owner
    asset    value;     // token value (1 SYS)
    string   tokenName; // token name
    string   tokenData; // 附件数据

    uint64_t primary_key() const { return id; }
    uint64_t get_owner() const { return owner.value; }
    string   get_uri() const { return uri; }
    asset    get_value() const { return value; }
    uint64_t get_symbol() const { return value.symbol.code().raw(); }
    string   get_tokenName() const { return tokenName; }
    string   get_tokenData() const { return tokenData; }
    // generated token global uuid based on token id and
    // contract name, passed in the argument
    uint128_t get_global_id(name self) const {
        uint128_t self_128 = static_cast<uint128_t>(self.value);
        uint128_t id_128   = static_cast<uint128_t>(id);
        uint128_t res      = (self_128 << 64) | (id_128);
        return res;
    }

    string get_unique_name() const {
        string unique_name = tokenName + "#" + std::to_string(id);
        return unique_name;
    }
};
using token_index = eosio::multi_index<
    "token"_n, token, indexed_by<"byowner"_n, const_mem_fun<token, uint64_t, &token::get_owner>>,
    indexed_by<"bysymbol"_n, const_mem_fun<token, uint64_t, &token::get_symbol>>>;

class [[eosio::contract("card_nft")]] card_nft : public contract {

  public:
    using contract::contract;
    card_nft(name receiver, name code, datastream<const char*> ds)
        : contract(receiver, code, ds)
        , tokens(receiver, receiver.value) {}

    // 创建nft类型
    [[eosio::action]] void create(name issuer, std::string symbol);

    // 指定nft类型创建货币
    [[eosio::action]] void issue(name to, asset quantity, vector<string> uris, string tkn_name, string memo, string tkn_data);

    [[eosio::action]] void transferid(name from, name to, uint64_t id, string memo);
    [[eosio::action]] void transfer(name from, name to, asset quantity, string memo);

    [[eosio::action]] void burn(name owner, uint64_t token_id);
    [[eosio::action]] void setrampayer(name payer, uint64_t id);

  private:
    token_index tokens;

    void mint(name owner, name ram_payer, asset value, string uri, string name, string data);

    void sub_balance(name owner, asset value);
    void add_balance(name owner, asset value, name ram_payer);
    void sub_supply(asset quantity);
    void add_supply(asset quantity);
};