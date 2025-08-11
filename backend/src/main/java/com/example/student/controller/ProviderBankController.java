package com.example.student.controller;

import com.example.student.model.ProviderBankAccount;
import com.example.student.repo.ProviderBankAccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/provider-bank")
@CrossOrigin
public class ProviderBankController {

    @Autowired
    private ProviderBankAccountRepo bankAccountRepo;

    @PostMapping("/add")
    public ResponseEntity<?> addBankAccount(@RequestBody ProviderBankAccount bankAccount) {
        try {
            // FIXED: Use correct method names
            bankAccount.setCreatedAt(LocalDateTime.now()); // Correct method
            bankAccount.setVerified(false); // Needs verification
            bankAccount.setActive(false); // Inactive until verified

            ProviderBankAccount saved = bankAccountRepo.save(bankAccount);

            System.out.println("🏦 Bank Account Added:");
            System.out.println("   Provider ID: " + saved.getProviderId());
            System.out.println("   Bank: " + saved.getBankName());
            System.out.println("   Account: ****" + saved.getAccountNumber().substring(Math.max(0, saved.getAccountNumber().length() - 4)));
            System.out.println("   Status: PENDING_VERIFICATION");

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding bank account: " + e.getMessage());
        }
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProviderBankAccount>> getProviderBankAccounts(@PathVariable String providerId) {
        try {
            if (providerId == null || providerId.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<ProviderBankAccount> accounts = bankAccountRepo.findByProviderId(providerId);

            System.out.println("📋 Retrieved Bank Accounts:");
            System.out.println("   Provider ID: " + providerId);
            System.out.println("   Total Accounts: " + accounts.size());

            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            System.err.println("❌ Error retrieving bank accounts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{accountId}/verify")
    public ResponseEntity<?> verifyBankAccount(@PathVariable String accountId) {
        try {
            if (accountId == null || accountId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Account ID cannot be empty");
            }

            Optional<ProviderBankAccount> optAccount = bankAccountRepo.findById(accountId);
            if (optAccount.isPresent()) {
                ProviderBankAccount account = optAccount.get();
                account.setVerified(true);
                account.setActive(true);
                account.setVerifiedAt(LocalDateTime.now()); // Correct method

                bankAccountRepo.save(account);

                System.out.println("✅ Bank Account Verified:");
                System.out.println("   Account ID: " + accountId);
                System.out.println("   Provider ID: " + account.getProviderId());
                System.out.println("   Bank: " + account.getBankName());
                System.out.println("   Status: VERIFIED & ACTIVE");

                return ResponseEntity.ok("Bank account verified successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Verification failed: " + e.getMessage());
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<ProviderBankAccount> getBankAccount(@PathVariable String accountId) {
        try {
            if (accountId == null || accountId.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Optional<ProviderBankAccount> account = bankAccountRepo.findById(accountId);
            if (account.isPresent()) {
                System.out.println("📄 Bank Account Retrieved:");
                System.out.println("   Account ID: " + accountId);
                System.out.println("   Status: " + (account.get().isVerified() ? "VERIFIED" : "PENDING"));

                return ResponseEntity.ok(account.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("❌ Error retrieving bank account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{accountId}/activate")
    public ResponseEntity<?> activateBankAccount(@PathVariable String accountId) {
        try {
            Optional<ProviderBankAccount> optAccount = bankAccountRepo.findById(accountId);
            if (optAccount.isPresent()) {
                ProviderBankAccount account = optAccount.get();

                if (!account.isVerified()) {
                    return ResponseEntity.badRequest().body("Account must be verified before activation");
                }

                account.setActive(true);
                bankAccountRepo.save(account);

                System.out.println("🔓 Bank Account Activated:");
                System.out.println("   Account ID: " + accountId);
                System.out.println("   Status: ACTIVE");

                return ResponseEntity.ok("Bank account activated successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Activation failed: " + e.getMessage());
        }
    }

    @PutMapping("/{accountId}/deactivate")
    public ResponseEntity<?> deactivateBankAccount(@PathVariable String accountId) {
        try {
            Optional<ProviderBankAccount> optAccount = bankAccountRepo.findById(accountId);
            if (optAccount.isPresent()) {
                ProviderBankAccount account = optAccount.get();
                account.setActive(false);
                bankAccountRepo.save(account);

                System.out.println("🔒 Bank Account Deactivated:");
                System.out.println("   Account ID: " + accountId);
                System.out.println("   Status: INACTIVE");

                return ResponseEntity.ok("Bank account deactivated successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Deactivation failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<?> deleteBankAccount(@PathVariable String accountId) {
        try {
            Optional<ProviderBankAccount> optAccount = bankAccountRepo.findById(accountId);
            if (optAccount.isPresent()) {
                ProviderBankAccount account = optAccount.get();

                // Safety check - don't delete if there are pending transfers
                if (account.isActive()) {
                    return ResponseEntity.badRequest().body("Cannot delete active bank account. Deactivate first.");
                }

                bankAccountRepo.deleteById(accountId);

                System.out.println("🗑️ Bank Account Deleted:");
                System.out.println("   Account ID: " + accountId);
                System.out.println("   Provider ID: " + account.getProviderId());

                return ResponseEntity.ok("Bank account deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Deletion failed: " + e.getMessage());
        }
    }

    @GetMapping("/verified")
    public ResponseEntity<List<ProviderBankAccount>> getAllVerifiedAccounts() {
        try {
            List<ProviderBankAccount> accounts = bankAccountRepo.findVerifiedAndActive();

            System.out.println("📋 All Verified Accounts:");
            System.out.println("   Total: " + accounts.size());

            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}