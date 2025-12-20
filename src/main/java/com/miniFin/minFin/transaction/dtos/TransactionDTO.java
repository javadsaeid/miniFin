package com.miniFin.minFin.transaction.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.enums.TransactionType;
import com.miniFin.minFin.enums.TransactionalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionDTO {
    private Long id;
    private BigDecimal amount;
    private TransactionType transactionType;
    private LocalDateTime transactionDateTime;
    private String description;
    private TransactionalStatus status;
    @JsonBackReference
    private AccountDTO account;
    private String sourceAccount;
    private String destinationAccount;
}
