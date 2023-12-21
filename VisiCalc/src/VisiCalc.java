import java.util.Scanner;

public class VisiCalc {
	static Grid g = new Grid();
	public static void main(String args[]) throws Exception {
		Scanner scanner = new Scanner(System.in);
		String[] tokens = {};
		String input;
		String userInput1;
		//String userInput2;
		String userInput3;
		int rowIndex = 0;
		int columnIndex = 0;
		System.out.println("Welcome to VisiCalc!");
		while (true) { 
			System.out.println("Enter:");
			input = scanner.nextLine();
			String delims = " ";
			//StringTokenizer st = new StringTokenizer(input, delims);
			tokens = input.split(delims);
			userInput1 = tokens[0];
			if (tokens.length == 1) {
			if (userInput1.equals("help")) {
				helpMethod();
				continue;
			}
			if (userInput1.equals("quit")) {
				System.out.println("Ok goodbye");
				break;
			}
			if (userInput1.equals("print")) {
				g.PrintGrid();
				continue;
			}
			else {
				columnIndex = g.getColumnIndex(Character.toString(userInput1.charAt(0)));
				rowIndex = g.getRowIndex(userInput1.substring(1, userInput1.length()));
				if (g.spreadsheet[rowIndex][columnIndex] instanceof TextCell) {
					g.spreadsheet[rowIndex][columnIndex] = g.obj;
					System.out.println(g.obj.text.substring(1, g.obj.text.length() - 1));
					continue;
				}
				else if (g.spreadsheet[rowIndex][columnIndex] instanceof DateCell) {
					g.spreadsheet[rowIndex][columnIndex] = g.dobj;
					System.out.println(g.dobj.m + "/" + g.dobj.d + "/" + g.dobj.y);
					continue;
				}
				else {
					System.out.println(g.spreadsheet[rowIndex][columnIndex].x);
					continue;
				}
			}
			}
			else {
			//userInput2 = tokens[1];
			userInput3 = tokens[2];
			if (userInput3.contains("\"") == true) {
				userInput3 += " ";
				for (int i = 3; i < tokens.length; i++) {
					userInput3 += tokens[i] + " ";			
				}
				TextCell ob = new TextCell(userInput3);
				g.obj = ob;
				columnIndex = g.getColumnIndex(Character.toString(userInput1.charAt(0)));
				rowIndex = g.getRowIndex(userInput1.substring(1, userInput1.length()));
				g.spreadsheet[rowIndex][columnIndex] = g.obj;
				continue;
			}
			else if (userInput3.contains("/")) {
				int index1 = 0;
				int index2 = 0;
				while (userInput3.charAt(index1) != '/') {
					index1++;
				}
				String month = userInput3.substring(0, index1);
				index1++;
				index2 = index1;
				while (userInput3.charAt(index2) != '/') {
					index2++;
				}
				String date = userInput3.substring(index1, index2);
				index2++;
				String year = userInput3.substring(index2, userInput3.length());
				DateCell obj = new DateCell(Integer.parseInt(month), Integer.parseInt(date), Integer.parseInt(year));
				g.dobj = obj;
				columnIndex = g.getColumnIndex(Character.toString(userInput1.charAt(0)));
				rowIndex = g.getRowIndex(userInput1.substring(1, userInput1.length()));
				g.spreadsheet[rowIndex][columnIndex] = g.dobj;
				continue;
			}
			else {
			Cell object = new Cell(Integer.parseInt(userInput3));
			columnIndex = g.getColumnIndex(Character.toString(userInput1.charAt(0)));
			rowIndex = g.getRowIndex(userInput1.substring(1, userInput1.length()));
			g.spreadsheet[rowIndex][columnIndex] = object;
			continue;
			}
			}
		}
		scanner.close();
		}
	
	public static void helpMethod() {
		System.out.println("This is a spreadsheet program which will allow us to enter in specific numbers and dates into different cells of the grid. "
				+ "And also print out the answers to any equations using the values that we have stored in the grid. "
				+ "Just like microsoft excel.");
	}
	
}
