package cse332.types;

import cse332.interfaces.worklists.FixedSizeFIFOWorkList;

public class BitString extends BString<Boolean> {
    public BitString(FixedSizeFIFOWorkList<Boolean> q) {
        super(q);
    }

    public BitString(Boolean[] s) {
        super(s);
    }

    public static Class<Boolean> getLetterType() {
        return Boolean.class;
    }

    public short get() {
        short result = 0;
        for (int i = this.str.size() - 1; i >= 0; i--) {
            result += this.str.peek(i) ? 1 << (this.str.size() - i - 1) : 0;
        }
        return result;
    }

    @Override
    public String toString() {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < this.str.size(); i++) {
            b.append(this.str.peek(i) ? "1" : "0");
        }
        return b.toString();
    }
}
