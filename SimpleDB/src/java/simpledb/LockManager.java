package simpledb;

import java.util.*;

/**
 * LockManager manages the locks on pages for transactions.
 */
public class LockManager {

    private final Map<PageId, Set<TransactionId>> sharedLocks;
    private final Map<PageId, TransactionId> exclusiveLocks;

    private final Map<TransactionId, Set<PageId>> transactionPages;

    // for deadlock detection
    private final Map<TransactionId, Set<TransactionId>> waitsFor;

    public LockManager() {
        this.exclusiveLocks = new HashMap<>();
        this.sharedLocks = new HashMap<>();
        this.transactionPages = new HashMap<>();
        this.waitsFor = new HashMap<>();
    }

    public Set<PageId> getPages(TransactionId tid) {
        return transactionPages.getOrDefault(tid, Collections.emptySet());
    }

    /**
     * Acquires a lock on the page for the given transaction
     * or returns false if the lock cannot be acquired.
     */
    public synchronized boolean acquireLock(TransactionId tid, PageId pid, Permissions perm) throws TransactionAbortedException {
        if (holdsLock(tid, pid, perm)) {
            return true; // already holds the lock
        }

        // Try to acquire shared lock
        if (perm == Permissions.READ_ONLY) {
            // If no exclusive lock or held by this tid, grant shared lock
            TransactionId xlock = exclusiveLocks.get(pid);
            if (xlock == null || xlock.equals(tid)) {
                sharedLocks.computeIfAbsent(pid, k -> new HashSet<>()).add(tid);
                transactionPages.computeIfAbsent(tid, k -> new HashSet<>()).add(pid);
                return true;
            } else {
                // Wait for exclusive lock holder
                addWaitsFor(tid, xlock);
                if (detectDeadlock(tid, new HashSet<>())) {
                    removeWaitsFor(tid, xlock);
                    throw new TransactionAbortedException();
                }
                return false;
            }
        }

        // Try to acquire exclusive lock
        if (perm == Permissions.READ_WRITE) {
            if (exclusiveLocks.get(pid) != null && exclusiveLocks.get(pid).equals(tid)) {
                return true;
            }
            if (!sharedLocks.containsKey(pid) && !exclusiveLocks.containsKey(pid)) {
                exclusiveLocks.put(pid, tid);
                transactionPages.computeIfAbsent(tid, k -> new HashSet<>()).add(pid);
                return true; // no locks, grant exclusive lock
            }

            // Upgrade
            Set<TransactionId> holders = sharedLocks.get(pid);
            if (holders != null && holders.size() == 1 && holders.contains(tid) && !exclusiveLocks.containsKey(pid)) {
                sharedLocks.remove(pid);
                exclusiveLocks.put(pid, tid);
                return true;
            }

            // Wait for all other holders to release
            Set<TransactionId> blockers = new HashSet<>();
            if (exclusiveLocks.containsKey(pid)) blockers.add(exclusiveLocks.get(pid));
            if (sharedLocks.containsKey(pid)) blockers.addAll(sharedLocks.get(pid));
            blockers.remove(tid); // don't wait for self
            for (TransactionId blocker : blockers) {
                addWaitsFor(tid, blocker);
            }
            if (detectDeadlock(tid, new HashSet<>())) {
                for (TransactionId blocker : blockers) {
                    removeWaitsFor(tid, blocker);
                }
                throw new TransactionAbortedException();
            }
            return false;
        }

        return false;
    }

    /**
     * Unlock the page for the given transaction.
     */
    public synchronized void releaseLock(TransactionId tid, PageId pid) {
        // Remove from shared locks
        if (sharedLocks.containsKey(pid)) {
            sharedLocks.get(pid).remove(tid);
            if (sharedLocks.get(pid).isEmpty()) {
                sharedLocks.remove(pid);
            }
        }
        // Remove from exclusive locks
        if (exclusiveLocks.get(pid) != null && exclusiveLocks.get(pid).equals(tid)) {
            exclusiveLocks.remove(pid);
        }
        // Remove from transactionPages
        if (transactionPages.containsKey(tid)) {
            transactionPages.get(tid).remove(pid);
            if (transactionPages.get(tid).isEmpty()) {
                transactionPages.remove(tid);
            }
        }
        // Remove waits-for edges
        waitsFor.remove(tid);
        for (Set<TransactionId> waiters : waitsFor.values()) {
            waiters.remove(tid);
        }
    }

    /**
     * Checks if the transaction holds a lock on the page.
     */
    public synchronized boolean holdsLock(TransactionId tid, PageId pid) {
        return (sharedLocks.containsKey(pid) && sharedLocks.get(pid).contains(tid))
            || (exclusiveLocks.get(pid) != null && exclusiveLocks.get(pid).equals(tid));
    }

    private boolean holdsLock(TransactionId tid, PageId pid, Permissions perm) {
        if (perm == Permissions.READ_ONLY) {
            return sharedLocks.containsKey(pid) && sharedLocks.get(pid).contains(tid)
                || (exclusiveLocks.get(pid) != null && exclusiveLocks.get(pid).equals(tid));
        } else {
            return exclusiveLocks.get(pid) != null && exclusiveLocks.get(pid).equals(tid);
        }
    }

    // ---------- GRAPH HELPERS ----------
    private void addWaitsFor(TransactionId waiter, TransactionId holder) {
        if (holder == null || waiter.equals(holder)) return;
        waitsFor.computeIfAbsent(waiter, k -> new HashSet<>()).add(holder);
    }

    private void removeWaitsFor(TransactionId waiter, TransactionId holder) {
        if (waitsFor.containsKey(waiter)) {
            waitsFor.get(waiter).remove(holder);
            if (waitsFor.get(waiter).isEmpty()) {
                waitsFor.remove(waiter);
            }
        }
    }

    // Deadlock detection using DFS
    private boolean detectDeadlock(TransactionId tid, Set<TransactionId> visited) {
        if (!waitsFor.containsKey(tid)) return false;
        if (!visited.add(tid)) {
            return true; // cycle detected
        }
        for (TransactionId other : waitsFor.get(tid)) {
            if (detectDeadlock(other, visited)) {
                return true;
            }
        }
        visited.remove(tid);
        return false;
    }
}