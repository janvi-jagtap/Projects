# SimpleDB

An implementation of a miniature relational database system called **SimpleDB**, written in Java. It includes components such as:

- **Query parsing and execution** using iterator trees (SeqScan, Filter, Join, Aggregate, etc.)
- **Buffer Pool** for in-memory page caching with eviction and locking
- **Transaction management** using strict two-phase locking (2PL)
- **Logging and Recovery** with support for rollback and crash recovery (undo/redo)
- **Join optimization** based on table statistics and cardinality estimation

### Features:
- LockManager for shared/exclusive locks with deadlock detection
- LogFile system with checkpoints and page recovery
- Histogram-based cardinality estimation with basic JoinOptimizer
- Manual eviction strategy and dirty-page tracking
- Support for query plans via logical and physical operators
