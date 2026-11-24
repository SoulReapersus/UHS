# Firestore Security Specification (Payload-First TDD)

## 1. Data Invariants
1. A `collegeVotes/{voteId}` document can only be created or updated by a verified user (`email_verified == true`), and its document ID must deterministically equal `{collegeId}_{request.auth.uid}` to guarantee one vote per student per college.
2. `collegeVotes` never store PII (`email`, `phone`, `address`) and strictly bound `predictedClosing` and `aggregateSnapshot` between `50` and `100`.
3. `admissionUpdates/{updateId}` records require `authorId == request.auth.uid`, enforce `verifiedSource == false` for non-admin users, and validate `createdAt == request.time`.
4. `users/{userId}/private/merit` is strictly isolated: only `request.auth.uid == userId` may read, list, create, update, or delete, with `preferredCollegeIds` bounded to `<= 17` entries.
5. `colleges/{collegeId}` can only be modified by an authenticated admin (`msaadvirk7@gmail.com` verified or `/admins/{uid}`).

## 2. Adversarial Test Payloads ("Dirty Dozen")
1. **Identity Spoofing on Vote Create**: `collegeVotes/kemu_victimUid` with `userId: "victimUid"` submitted by `attackerUid` -> DENIED.
2. **Double Vote Key Bypass**: `collegeVotes/random_id_123` with `userId: attackerUid` -> DENIED (`voteId != collegeId + '_' + uid`).
3. **Shadow Field Injection on Vote**: `collegeVotes/kemu_attackerUid` adding `isAdmin: true` -> DENIED (`hasOnly` rejects extra keys).
4. **Unverified Email Write**: Vote or update submitted with `email_verified: false` -> DENIED.
5. **Out-of-Bounds Merit Poisoning**: Vote with `predictedClosing: 999` or `aggregateSnapshot: -10` -> DENIED.
6. **Verified Badge Escalation**: Non-admin creating `admissionUpdates/upd1` with `verifiedSource: true` -> DENIED.
7. **Timestamp Forgery**: Creating `admissionUpdates/upd2` with backdated client `createdAt` (`!= request.time`) -> DENIED.
8. **Update-Gap Author Swap**: Updating `admissionUpdates/upd1` to change `authorId` -> DENIED (`affectedKeys().hasOnly(...)` + `incoming().authorId == existing().authorId`).
9. **Cross-User PII Read**: `attackerUid` reading `users/victimUid/private/merit` -> DENIED.
10. **Unbounded Array Exhaustion**: `users/uid/private/merit` with `preferredCollegeIds` of length 50 -> DENIED (`size() <= 17`).
11. **Path ID Poisoning**: Creating `admissionUpdates/` with 200-char or special-char ID -> DENIED (`isValidId`).
12. **Unauthorized College Mutate**: Non-admin attempting to alter `colleges/kemu` closing merit -> DENIED (`isAdmin()`).
