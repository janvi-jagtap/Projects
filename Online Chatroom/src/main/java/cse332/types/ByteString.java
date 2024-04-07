package cse332.types;

import cse332.interfaces.worklists.FixedSizeFIFOWorkList;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

public class ByteString extends BString<Byte> {
    public ByteString(String s) {
        super(BString.wrap(s.getBytes()));
    }

    public ByteString(byte[] s) {
        super(BString.wrap(s));
    }

    public ByteString(FixedSizeFIFOWorkList<Byte> q) {
        super(q);
    }

    public ByteString(Byte[] s) {
        super(s);
    }

    public static Class<Byte> getLetterType() {
        return Byte.class;
    }

    @Override
    public String toString() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        for (int i = 0; i < this.str.size(); i++) {
            out.write(this.str.peek(i));
        }
        return out.toString(StandardCharsets.UTF_8);
    }
}
