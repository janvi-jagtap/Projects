package chat;

import javax.swing.*;
import java.util.Collections;
import java.util.List;

public class UsersModel extends AbstractListModel<String> {
    private List<String> usernames;

    public UsersModel(List<String> usernames) {
        this.usernames = usernames;
    }

    private static final long serialVersionUID = 1L;

    @Override
    public int getSize() {
        return this.usernames.size();
    }

    @Override
    public String getElementAt(int index) {
        return this.usernames.get(index);
    }

    public void remove(String s) {
        this.usernames.remove(s);
        fireContentsChanged(this, 0, this.usernames.size() - 1);
    }

    public void add(String s) {
        this.usernames.add(s);
        Collections.sort(this.usernames);
        fireContentsChanged(this, 0, this.usernames.size() - 1);
    }

    public void update(List<String> usernames) {
        this.usernames = usernames;
        fireContentsChanged(this, 0, usernames.size() - 1);
    }
}
