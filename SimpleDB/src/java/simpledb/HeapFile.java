package simpledb;

import java.io.*;
import java.util.*;

/**
 * HeapFile is an implementation of a DbFile that stores a collection of tuples
 * in no particular order. Tuples are stored on pages, each of which is a fixed
 * size, and the file is simply a collection of those pages. HeapFile works
 * closely with HeapPage. The format of HeapPages is described in the HeapPage
 * constructor.
 * 
 * @see simpledb.HeapPage#HeapPage
 * @author Sam Madden
 */
public class HeapFile implements DbFile {

    private File file;
    private TupleDesc tupleDesc;

    /**
     * Constructs a heap file backed by the specified file.
     * 
     * @param f
     *            the file that stores the on-disk backing store for this heap
     *            file.
     */
    public HeapFile(File f, TupleDesc td) {
        this.file = f;
        this.tupleDesc = td;
    }

    /**
     * Returns the File backing this HeapFile on disk.
     * 
     * @return the File backing this HeapFile on disk.
     */
    public File getFile() {
        return this.file;
    }

    /**
     * Returns an ID uniquely identifying this HeapFile. Implementation note:
     * you will need to generate this tableid somewhere to ensure that each
     * HeapFile has a "unique id," and that you always return the same value for
     * a particular HeapFile. We suggest hashing the absolute file name of the
     * file underlying the heapfile, i.e. f.getAbsoluteFile().hashCode().
     * 
     * @return an ID uniquely identifying this HeapFile.
     */
    public int getId() {
        return 31 * this.file.getAbsoluteFile().hashCode();
    }

    /**
     * Returns the TupleDesc of the table stored in this DbFile.
     * 
     * @return TupleDesc of this DbFile.
     */
    public TupleDesc getTupleDesc() {
        return this.tupleDesc;
    }

    // see DbFile.java for javadocs
    public Page readPage(PageId pid) {
        HeapPageId hpid = (HeapPageId) pid;
        int pageNumber = hpid.getPageNumber();
        int pageSize = BufferPool.getPageSize();
        byte[] pageData = new byte[pageSize];

        try (RandomAccessFile r = new RandomAccessFile(file, "r")) {
            r.seek((long) pageNumber * pageSize);
            r.readFully(pageData);
            return new HeapPage(hpid, pageData);
        }
        catch (IOException e) {
            throw new IllegalArgumentException("Can't read page");
        }
    }

    // see DbFile.java for javadocs
    public void writePage(Page page) throws IOException {
        HeapPageId hpid = (HeapPageId) page.getId();
        int pageNumber = hpid.getPageNumber();
        int pageSize = BufferPool.getPageSize();
        byte[] pageData = page.getPageData();

        try (RandomAccessFile r = new RandomAccessFile(file, "rw")) {
            r.seek((long) pageNumber * pageSize);
            r.write(pageData);
        }
        catch (IOException e) {
            throw new IOException("Can't write page");
        }
    }

    /**
     * Returns the number of pages in this HeapFile.
     */
    public int numPages() {
        return (int) (this.file.length() / BufferPool.getPageSize());
    }

    // see DbFile.java for javadocs
    public ArrayList<Page> insertTuple(TransactionId tid, Tuple t)
            throws DbException, IOException, TransactionAbortedException {
        ArrayList<Page> pages = new ArrayList<>();
        int numPages = numPages();
        boolean inserted = false;

        // find a page with space for the tuple
        for (int i = 0; i < numPages; i++) {
            HeapPageId pageId = new HeapPageId(getId(), i);
            HeapPage page = (HeapPage) Database.getBufferPool().getPage(tid, pageId,
                    Permissions.READ_WRITE);
            if (page != null && page.getNumEmptySlots() > 0) {
                page.insertTuple(t);
                pages.add(page);
                inserted = true;
                break;
            }
        }
        // create a new page and insert the tuple
        if (!inserted) {
            HeapPageId newPageId = new HeapPageId(getId(), numPages);
            HeapPage newPage = new HeapPage(newPageId, HeapPage.createEmptyPageData());
            writePage(newPage);
            HeapPage cachedPage = (HeapPage) Database.getBufferPool().getPage(tid, newPageId, Permissions.READ_WRITE); //Caching the page
            cachedPage.insertTuple(t);
            pages.add(cachedPage);
        }
        return pages;
    }

    // see DbFile.java for javadocs
    public ArrayList<Page> deleteTuple(TransactionId tid, Tuple t) throws DbException,
            TransactionAbortedException {
        ArrayList<Page> pages = new ArrayList<>();
        HeapPageId pageId = (HeapPageId) t.getRecordId().getPageId();
        HeapPage page = (HeapPage) Database.getBufferPool().getPage(tid, pageId,
                Permissions.READ_WRITE);
        if (page == null) {
            throw new DbException("Tuple not found in page");
        }
        page.deleteTuple(t);
        pages.add(page);
        return pages;
    }

    // see DbFile.java for javadocs
    public DbFileIterator iterator(TransactionId tid) {
        return new HeapIterator(tid);
    }


    /**
     * HeapIterator iterates over the tuples in a heap file.
     */
    public class HeapIterator extends AbstractDbFileIterator {
        private int currPage;
        private Iterator<Tuple> currIterator;
        private final TransactionId tid;

        public HeapIterator(TransactionId tid) {
            this.tid = tid;
            this.currPage = 0;
            this.currIterator = null;
        }

        @Override
        public void open() throws DbException, TransactionAbortedException {
            currPage = 0;
            currIterator = getNextPageIterator();
        }

        @Override
        public boolean hasNext() throws DbException, TransactionAbortedException {
            if (currIterator == null) {
                return false;
            }
            if (currIterator.hasNext()) {
                return true;
            } else {
                currIterator = getNextPageIterator();
                return hasNext();
            }
        }

        @Override
        public Tuple next() throws DbException, TransactionAbortedException,
                NoSuchElementException {
            if (currIterator == null || !currIterator.hasNext()) {
                throw new NoSuchElementException("No more tuples");
            }
            return currIterator.next();
        }

        private Iterator<Tuple> getNextPageIterator() throws DbException,
                TransactionAbortedException {
            if (currPage >= numPages()) {
                return null;
            }
            HeapPageId pageId = new HeapPageId(getId(), currPage);
            HeapPage page = (HeapPage) Database.getBufferPool().getPage(tid, pageId,
                    Permissions.READ_ONLY);
            currPage++;
            return page.iterator();
        }

        @Override
        public Tuple readNext() throws DbException, TransactionAbortedException {
            if (currIterator == null || !currIterator.hasNext()) {
                return null;
            }
            return currIterator.next();
        }

        @Override
        public void close() {
            currPage = 0;
            currIterator = null;
        }

        @Override
        public void rewind() throws DbException, TransactionAbortedException {
            close();
            open();
        }
    }
}

