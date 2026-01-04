package com.miniFin.minFin.transaction.service;

import com.miniFin.minFin.account.repo.AccountRepo;
import com.miniFin.minFin.auth_users.service.UserService;
import com.miniFin.minFin.notification.service.NotificationService;
import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import com.miniFin.minFin.transaction.dtos.TransactionRequest;
import com.miniFin.minFin.transaction.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepo transactionRepo;
    private final AccountRepo accountRepo;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ModelMapper modelMapper;


    @Override
    public Response<?> createTransaction(TransactionRequest transactionRequest) {
        return null;
    }

    @Override
    public Response<List<TransactionDTO>> getTransactionsForAnAccount(String account, int page, int size) {
        return null;
    }
}
