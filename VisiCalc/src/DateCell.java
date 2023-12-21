public class DateCell extends Cell {
	int m;
	int d;
	int y;
	
	public DateCell(int month, int date, int year) {
		super(0);
		m = month;
		d = date;
		y = year;
	}
}
