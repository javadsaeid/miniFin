package com.miniFin.minFin.account.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.enums.AccountType;
import com.miniFin.minFin.enums.Currency;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {

    private Long id;
    private String accountNumber;
    private BigDecimal balance;
    private AccountType accountType;
    @JsonBackReference
    private UserDTO user;
    private Currency currency;
    @JsonManagedReference
    private List<TransactionDTO> transactions;
}
