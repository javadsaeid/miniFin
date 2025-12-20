package com.miniFin.minFin.transaction.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.miniFin.minFin.enums.TransactionType;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionRequest {
    private TransactionType transactionType;
    private BigDecimal amount;
    private String accountNumber;
    private String destinationAccountNumber;
    private String description;
}
