// VisiCalc
// Janvi Jagtap
// AP Computer Science

//Helper class
public class Grid {
Cell[][] spreadsheet = new Cell[10][7];
TextCell obj = null;
DateCell dobj = null;
public void PrintGrid() {
	char letter = 'A';
	int number = 1;
	System.out.print("       ");
	for (int i = 0; i < 7; i++) {
		System.out.print("|   " + letter + "   ");
		letter++;
	}
	System.out.println("|");
	System.out.println("================================================================");
	for (int r = 0; r < 10; r++) {
		if (number == 10) {
			System.out.print("  " + number + "   ");
		}
		else {
		System.out.print("   " + number + "   ");
		number++;
		}
		for (int c = 0; c < 7; c++) {
			if(spreadsheet[r][c] == null) {
				System.out.print("|       ");
			}
			else if(spreadsheet[r][c].x == 0) {
				if (spreadsheet[r][c] instanceof TextCell) {
					spreadsheet[r][c] = obj;
					printTextCell(r, c, obj);
				}
				else {
					spreadsheet[r][c] = dobj;
					printDateCell(r, c, dobj);
				}
			}
			else {
				printRegularCell(r, c, spreadsheet[r][c]);
				
			}
		}
		System.out.println("|");
		System.out.println("================================================================");

	}

}



public int getColumnIndex(String letter) {
	char charLetter = letter.charAt(0);
	char comparingLetter = 'A';
	int count = 0;
	for(int i = 0; i < 7; i++) {
		if (charLetter != comparingLetter) {
			count++;
			comparingLetter++;
		}
	}
	return count;
}

public int getRowIndex(String number) {
	int numberr = Integer.parseInt(number);
	int comparingNumber = 1;
	int count = 0;
	for (int i = 0; i < 10; i++) {
		if(numberr != comparingNumber) {
			count++;
			comparingNumber++;
		}
	}
	return count;
}

public void printRegularCell(int RowIndex, int ColumnIndex, Cell obj) {
	String output = Integer.toString(obj.x);
	if (output.length() <= 7) {
		String space = " ";
		for (int i = 0; i < 7; i++) {
			if (output.length() < i) {
				space+= " ";
			}
			
		}
		System.out.print("|" + output + space);
	}
	else {
		System.out.print("|" + output.substring(0, 7));
		}
	
}

public void printTextCell(int RowIndex, int ColumnIndex, TextCell obj) {
	String output = obj.text.substring(1, obj.text.length() - 1);
	if (output.length() <= 7) {
		String space = " ";
		for (int i = 0; i < 7; i++) {
			if (output.length() < i) {
				space+= " ";
			}
			
		}
		System.out.print("|" + output + space);
	}
	else {
		System.out.print("|" + output.substring(0, 7));
		}
	}

public void printDateCell(int RowIndex, int ColumnIndex, DateCell obj) {
	String output = (Integer.toString(obj.m)) + "/" + (Integer.toString(obj.d) + "/" + (Integer.toString(obj.y)));
	if (output.length() <= 7) {
		String space = " ";
		for (int i = 0; i < 7; i++) {
			if (output.length() < i) {
				space+= " ";
			}
			
		}
		System.out.print("|" + output + space);
	}
	else {
		System.out.print("|" + output.substring(0, 7));
		}
	}
	
			
}


