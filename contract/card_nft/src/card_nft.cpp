#include "card_nft.hpp"
using namespace eosio;

void card_nft::create(name issuer, std::string sym) {

    require_auth(_self);

    // Check if issuer account exists
    check(is_account(issuer), "issuer account does not exist");

    // Valid symbol
    asset supply(0, symbol(symbol_code(sym.c_str()), 0));

    auto symbol = supply.symbol;
    check(symbol.is_valid(), "invalid symbol name");

    // Check if currency with symbol already exists
    auto           symbol_name = symbol.code().raw();
    currency_index currency_table(_self, symbol_name);
    auto           existing_currency = currency_table.find(symbol_name);
    eosio::check(existing_currency == currency_table.end(), "card with symbol already exists");

    // Create new currency
    currency_table.emplace(_self, [&](auto& currency) {
        currency.supply = supply;
        currency.issuer = issuer;
    });
}

void card_nft::issue(name to, asset quantity, vector<string> uris, string tkn_name, string memo, string tkn_data) {

    check(is_account(to), "to account does not exist");

    // e,g, Get EOS from 3 EOS
    auto symbol = quantity.symbol;
    check(symbol.is_valid(), "invalid symbol name");
    check(symbol.precision() == 0, "quantity must be a whole number");
    check(memo.size() <= 256, "memo has more than 256 bytes");

    check(tkn_name.size() <= 32, "name has more than 32 bytes");

    // Ensure currency has been created
    auto           symbol_name = symbol.code().raw();
    currency_index currency_table(_self, symbol_name);
    auto           existing_currency = currency_table.find(symbol_name);
    check(existing_currency != currency_table.end(), "token with symbol does not exist. create token before issue");
    const auto& st = *existing_currency;

    // Ensure have issuer authorization and valid quantity
    require_auth(st.issuer);
    check(quantity.is_valid(), "invalid quantity");
    check(quantity.amount > 0, "must issue positive quantity of card_nft");
    check(symbol == st.supply.symbol, "symbol precision mismatch");

    // Increase supply
    add_supply(quantity);

    // Check that number of tokens matches uri size
    check(quantity.amount == uris.size(), "mismatch between number of tokens and uris provided");

    // Mint card_nfts
    for (auto const& uri : uris) {
        mint(to, st.issuer, asset{1, symbol}, uri, tkn_name, tkn_data);
    }
    // check(quantity.amount == 3, "mismatch between number of tokens and uris provided 3333");

    // Add balance to account
    add_balance(to, quantity, st.issuer);
}

void card_nft::transferid(name from, name to, uint64_t id, string memo) {
    // Ensure authorized to send from account
    check(from != to, "cannot transfer to self");
    require_auth(from);

    // Ensure 'to' account exists
    check(is_account(to), "to account does not exist");

    // Check memo size and print
    check(memo.size() <= 256, "memo has more than 256 bytes");

    // Ensure token ID exists
    auto send_token = cardbooks.find(id);
    check(send_token != cardbooks.end(), "token with specified ID does not exist");

    // Ensure owner owns token
    check(send_token->owner == from, "sender does not own token with specified ID");

    const auto& st = *send_token;

    // Notify both recipients
    require_recipient(from);
    require_recipient(to);

    // Transfer card_nft from sender to receiver
    cardbooks.modify(send_token, from, [&](auto& token) { token.owner = to; });

    // Change balance of both accounts
    sub_balance(from, st.value);
    add_balance(to, st.value, from);
}

void card_nft::transfer(name from, name to, asset quantity, string memo) {
    // Ensure authorized to send from account
    check(from != to, "cannot transfer to self");
    require_auth(from);

    // Ensure 'to' account exists
    check(is_account(to), "to account does not exist");

    // Check memo size and print
    check(memo.size() <= 256, "memo has more than 256 bytes");

    check(quantity.amount == 1, "cannot transfer quantity, not equal to 1");

    auto symbl = cardbooks.get_index<"bysymbol"_n>();

    auto it = symbl.lower_bound(quantity.symbol.code().raw());

    bool     found = false;
    uint64_t id    = 0;
    for (; it != symbl.end(); ++it) {

        if (it->value.symbol == quantity.symbol && it->owner == from) {
            id    = it->id;
            found = true;
            break;
        }
    }

    check(found, "token is not found or is not owned by account");

    // Notify both recipients
    require_recipient(from);
    require_recipient(to);

    SEND_INLINE_ACTION(*this, transferid, {from, "active"_n}, {from, to, id, memo});
}
void card_nft::mint(name owner, name ram_payer, asset value, string uri, string tkn_name, string data) {
    // Add token with creator paying for RAM
    cardbooks.emplace(ram_payer, [&](auto& cardbook) {
        cardbook.id        = cardbooks.available_primary_key();
        cardbook.uri       = uri;
        cardbook.owner     = owner;
        cardbook.value     = value;
        cardbook.cardName = tkn_name;
        cardbook.tokenData = data;
    });
}

void card_nft::setrampayer(name payer, uint64_t id) {

    require_auth(payer);

    // Ensure token ID exists
    auto payer_token = cardbooks.find(id);
    check(payer_token != cardbooks.end(), "token with specified ID does not exist");

    // Ensure payer owns token
    check(payer_token->owner == payer, "payer does not own token with specified ID");

    const auto& st = *payer_token;

    // Notify payer
    require_recipient(payer);

    /*tokens.erase(payer_token);
 	tokens.emplace(payer, [&](auto& token){
  		token.id = st.id;
  		token.uri = st.uri;
  		token.owner = st.owner;
  		token.value = st.value;
  		token.name = st.name;
 	});*/

    // Set owner as a RAM payer
    cardbooks.modify(payer_token, payer, [&](auto& cardbook) {
        cardbook.id        = st.id;
        cardbook.uri       = st.uri;
        cardbook.owner     = st.owner;
        cardbook.value     = st.value;
        cardbook.cardName = st.cardName;
        cardbook.tokenData = st.tokenData;
    });

    sub_balance(payer, st.value);
    add_balance(payer, st.value, payer);
}

void card_nft::burn(name owner, uint64_t token_id) {

    require_auth(owner);

    // Find token to burn
    auto burn_token = cardbooks.find(token_id);
    check(burn_token != cardbooks.end(), "token with id does not exist");
    check(burn_token->owner == owner, "token not owned by account");

    asset burnt_supply = burn_token->value;

    // Remove token from tokens table
    cardbooks.erase(burn_token);

    // Lower balance from owner
    sub_balance(owner, burnt_supply);

    // Lower supply from currency
    sub_supply(burnt_supply);
}

void card_nft::sub_balance(name owner, asset value) {

    account_index from_acnts(_self, owner.value);
    const auto&   from = from_acnts.get(value.symbol.code().raw(), "no balance object found");
    check(from.balance.amount >= value.amount, "overdrawn balance");

    if (from.balance.amount == value.amount) {
        from_acnts.erase(from);
    } else {
        from_acnts.modify(from, owner, [&](auto& a) { a.balance -= value; });
    }
}

void card_nft::add_balance(name owner, asset value, name ram_payer) {

    account_index to_accounts(_self, owner.value);
    auto          to = to_accounts.find(value.symbol.code().raw());
    if (to == to_accounts.end()) {
        to_accounts.emplace(ram_payer, [&](auto& a) { a.balance = value; });
    } else {
        to_accounts.modify(to, _self, [&](auto& a) { a.balance += value; });
    }
}

void card_nft::sub_supply(asset quantity) {

    auto           symbol_name = quantity.symbol.code().raw();
    currency_index currency_table(_self, symbol_name);
    auto           current_currency = currency_table.find(symbol_name);

    currency_table.modify(current_currency, _self, [&](auto& currency) { currency.supply -= quantity; });
}

void card_nft::add_supply(asset quantity) {

    auto           symbol_name = quantity.symbol.code().raw();
    currency_index currency_table(_self, symbol_name);
    auto           current_currency = currency_table.find(symbol_name);

    currency_table.modify(current_currency, name(0), [&](auto& currency) { currency.supply += quantity; });
}
EOSIO_DISPATCH(card_nft, (create)(issue)(transfer)(transferid)(setrampayer)(burn))