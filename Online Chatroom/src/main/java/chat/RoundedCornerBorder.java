package chat;

import javax.swing.border.AbstractBorder;
import java.awt.*;
import java.awt.geom.Area;
import java.awt.geom.Rectangle2D;
import java.awt.geom.RoundRectangle2D;

public class RoundedCornerBorder extends AbstractBorder {
    private static final long serialVersionUID = 1L;

    @Override
    public void paintBorder(Component c, Graphics g, int x, int y, int width,
            int height) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);
        int r = 20;
        RoundRectangle2D round = new RoundRectangle2D.Float(x, y, width - 1, height - 1,
                r, r);
        Container parent = c.getParent();
        if (parent != null) {
            g2.setColor(parent.getBackground());
            Area corner = new Area(new Rectangle2D.Float(x, y, width, height));
            corner.subtract(new Area(round));
            g2.fill(corner);
        }
        g2.setColor(Color.GRAY);
        g2.draw(round);
        g2.dispose();
    }

    @Override
    public Insets getBorderInsets(Component c) {
        return new Insets(5, 8, 5, 8);
    }

    @Override
    public Insets getBorderInsets(Component c, Insets insets) {
        insets.left = insets.right = 8;
        insets.top = insets.bottom = 5;
        return insets;
    }
}
