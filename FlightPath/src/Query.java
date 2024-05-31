package flightapp;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

/**
 * Runs queries against a back-end database
 */
public class Query extends QueryAbstract {
  //
  // Canned queries
  //
  private static final String FLIGHT_CAPACITY_SQL = "SELECT capacity FROM Flights WHERE fid = ?";
  private PreparedStatement flightCapacityStmt;

  private static final String CLEARTABLE_RESERVATION = "DELETE FROM Reservations_janvi26";
  private PreparedStatement clearTables_reservations;

  private static final String CLEARTABLE_USERS = "DELETE FROM Users_janvi26";
  private PreparedStatement clearTables_users;

  private String loginCheck = null;
  private static final String LOGIN_USERS = "SELECT * FROM Users_janvi26 WHERE username = ?";
  private PreparedStatement login_users;

  private static final String INSERT_USERS = "INSERT INTO Users_janvi26" + " VALUES(?, ?, ?)";
  private PreparedStatement insert_users;

  private static final String DIRECT_FLIGHTS_SEARCH = 
    "SELECT fid, origin_city, dest_city, actual_time, day_of_month, " +
    "carrier_id, flight_num, capacity, price FROM Flights " +
    "WHERE origin_city = ? AND dest_city = ? AND day_of_month = ? AND canceled = 0 " +
    "ORDER BY actual_time ASC, fid ASC";
    private PreparedStatement direct_flight_search;

  private static final String INDIRECT_FLIGHT_SEARCH = 
  "SELECT * " +
    "FROM ( " +
    "SELECT TOP (?) " +
    "fid AS first_fid, " + 
    "origin_city AS first_origin_city, " +
    "dest_city AS first_dest_city, " + 
    "actual_time AS total_flight_time, " +
    "day_of_month AS first_day_of_month, " +
    "carrier_id AS first_carrier_id, " +
    "flight_num AS first_flight_num, " +
    "capacity AS first_capacity, " +
    "price AS first_price, " +
	"NULL AS first_actual_time, " +
    "NULL AS second_fid, " +
    "NULL AS second_origin_city, " +
    "NULL AS second_dest_city, " + 
    "NULL AS second_actual_time, " + 
    "NULL AS second_day_of_month, " +
    "NULL AS second_carrier_id, " + 
    "NULL AS second_flight_num, " + 
    "NULL AS second_capacity, " + 
    "NULL AS second_price " + 
"FROM Flights " + 
"WHERE origin_city = ? " +  
    "AND dest_city = ? " + 
    "AND day_of_month = ? " + 
    "AND canceled = 0 " + 
    "ORDER BY actual_time ASC, fid ASC " +
"UNION ALL " +
"SELECT TOP (?) " +
    "f1.fid AS first_fid, " +
    "f1.origin_city AS first_origin_city, " + 
    "f1.dest_city AS first_dest_city, " +
    "(f1.actual_time + f2.actual_time) AS total_flight_time, " +
    "f1.day_of_month AS first_day_of_month, " + 
    "f1.carrier_id AS first_carrier_id, " + 
    "f1.flight_num AS first_flight_num, " +
    "f1.capacity AS first_capacity, " +
    "f1.price AS first_price, " +
	"f1.actual_time AS first_flight_time, " +
    "f2.fid AS second_fid, " +
    "f2.origin_city AS second_origin_city, " +
    "f2.dest_city AS second_dest_city, " +
    "f2.actual_time AS second_actual_time, " +
    "f2.day_of_month AS second_day_of_month, " +
    "f2.carrier_id AS second_carrier_id, " +
    "f2.flight_num AS second_flight_num, " +
    "f2.capacity AS second_capacity, " +
    "f2.price AS second_price " +
"FROM Flights f1 " +
"JOIN Flights f2 " +
    "ON f1.dest_city = f2.origin_city " +
    "AND f1.day_of_month = f2.day_of_month " +
    "AND f1.canceled = 0 " +
    "AND f2.canceled = 0 " +
"WHERE f1.origin_city = ? " +
    "AND f2.dest_city = ? " +
    "AND f1.day_of_month = ? " +
"ORDER BY " +
    "(f1.actual_time + f2.actual_time) ASC, " +
    "f1.fid ASC, " +
    "f2.fid ASC " +
    ") AS CombinedFlights " +
    "ORDER BY " +
    "total_flight_time ASC, " +
    "first_fid ASC, " +
    "second_fid ASC";
    private PreparedStatement indirect_flight_search;

    private List<List<Integer>> itineraries = new ArrayList<>();

    private static final String GET_RESERVED_FLIGHT_DATES = 
    "SELECT " +
    "FLIGHTS.month_id AS month, " +
    "FLIGHTS.day_of_month AS day " +
    "FROM " +
    "Reservations_janvi26 " +
    "JOIN " +
    "FLIGHTS ON Reservations_janvi26.fid1 = FLIGHTS.fid " +
    "WHERE " +
    "Reservations_janvi26.username = ?";
    private PreparedStatement get_reserved_flight_dates;

    private static final String GET_FLIGHT_DATE = 
    "SELECT " +
    "month_id AS month, " +
    "day_of_month AS day " +
    "FROM " +
    "FLIGHTS " +
    "WHERE " +
    "fid = ?";
    private PreparedStatement get_flight_date;

    private static final String GET_FLIGHT_CAPACITY = 
    "SELECT "+
    "capacity AS capacity " +
    "FROM " +
    "FLIGHTS " +
    "WHERE " +
    "fid = ?";
    private PreparedStatement get_flight_capacity;

    private static final String RESERVATION_COUNT = 
    "SELECT " +
    "COUNT (*) AS TotalBookings " +
    "FROM " +
    "Reservations_janvi26 " +
    "WHERE " +
    "fid1 = ?";
    private PreparedStatement reservation_count;

    private static final String TOTAL_RESERVATIONS = 
    "SELECT " +
    "COUNT(*) AS TotalReservations " +
    "FROM " +
    "Reservations_janvi26";
    private PreparedStatement total_reservations;

    private static final String ADDING_RESERVATIONS = 
    "INSERT INTO Reservations_janvi26 (res_id, paid, username, fid1, fid2) " +
    "VALUES (?, 0, ?, ?, ?)";
    private PreparedStatement adding_reservations;

    private static final String GET_RESERVATIONS = 
    "SELECT " +
    "paid AS paid, " +
    "username as username " +
    "FROM " +
    "Reservations_janvi26 " +
    "WHERE " +
    "res_id = ?";
    private PreparedStatement get_reservations;

    private static final String CHECK_BALANCE_AND_PRICE = 
    "SELECT r.res_id, r.username, u.balance AS balance, f1.price AS price_fid1, f2.price AS price_fid2 " +
    "FROM Reservations_janvi26 r " +
    "JOIN Users_janvi26 u ON r.username = u.username " +
    "JOIN Flights f1 ON r.fid1 = f1.fid " +
    "LEFT JOIN FLIGHTS f2 on r.fid2 = f2.fid " +
    "WHERE r.res_id = ?";
    private PreparedStatement check_balance_and_price;   

    private static final String UPDATE_PAID = 
    "UPDATE Reservations_janvi26 " +
    "SET paid = 1 " +
    "WHERE res_id = ?";
    private PreparedStatement update_paid;

    private static final String UPDATE_BALANCE = 
    "UPDATE Users_janvi26 " +
    "SET balance = ? " + 
    "WHERE username = ?";
    private PreparedStatement update_balance;

    private static final String USER_AMT_OF_RESERVATIONS = 
    "SELECT COUNT (*) AS num_reservations " +
    "FROM Reservations_janvi26 " +
    "WHERE username = ?";
    private PreparedStatement user_amt_of_reservations;
    
    private static final String GET_USER_RESERVATIONS = 
    "SELECT " +
    "r.res_id AS id, " +
    "r.paid AS paid, " +
    "f1.fid AS flight1_id, " +
    "f1.day_of_month AS flight1_day, " +
    "f1.carrier_id AS flight1_carrier, " +
    "f1.flight_num AS flight1_num, " +
    "f1.origin_city AS flight1_origin, " + 
    "f1.dest_city AS flight1_dest, " +
    "f1.actual_time AS flight1_duration, " +
    "f1.capacity AS flight1_capacity, " +
    "f1.price AS flight1_price, " +
    "f2.fid AS flight2_id, " +
    "f2.day_of_month AS flight2_day, " +
    "f2.flight_num AS flight2_num, " +
    "f2.carrier_id AS flight2_carrier, " +
    "f2.origin_city AS flight2_origin, " +
    "f2.dest_city AS flight2_dest, " +
    "f2.actual_time AS flight2_duration, " +
    "f2.capacity AS flight2_capacity, " +
    "f2.price AS flight2_price " +
    "FROM Reservations_janvi26 r " +
    "INNER JOIN FLIGHTS f1 on r.fid1 = f1.fid " +
    "LEFT JOIN FLIGHTS f2 ON r.fid2 = f2.fid " +
    "WHERE r.username = ? " +
    "ORDER BY r.res_id ASC";
    private PreparedStatement get_user_reservations;


  //
  // Instance variables
  //


  protected Query() throws SQLException, IOException {
    prepareStatements();
  }

  /**
   * Clear the data in any custom tables created.
   * 
   * WARNING! Do not drop any tables and do not clear the flights table.
   */
  public void clearTables() {
    try {
      clearTables_reservations.executeUpdate();
      clearTables_users.executeUpdate();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /*
   * prepare all the SQL statements in this method.
   */
  private void prepareStatements() throws SQLException {
    flightCapacityStmt = conn.prepareStatement(FLIGHT_CAPACITY_SQL);

    //Clearing the tables
    clearTables_reservations = conn.prepareStatement(CLEARTABLE_RESERVATION);
    clearTables_users = conn.prepareStatement(CLEARTABLE_USERS);

    //User login
    login_users = conn.prepareStatement(LOGIN_USERS);

    //Create users
    insert_users = conn.prepareStatement(INSERT_USERS);

    //Searching for direct flights
    direct_flight_search = conn.prepareStatement(DIRECT_FLIGHTS_SEARCH);

    //Searching for indirect flights
    indirect_flight_search = conn.prepareStatement(INDIRECT_FLIGHT_SEARCH);

    //Get the month and day for already reserved flights for the current user
    get_reserved_flight_dates = conn.prepareStatement(GET_RESERVED_FLIGHT_DATES);

    get_flight_date = conn.prepareStatement(GET_FLIGHT_DATE);

    get_flight_capacity = conn.prepareStatement(GET_FLIGHT_CAPACITY);

    reservation_count = conn.prepareStatement(RESERVATION_COUNT);

    total_reservations = conn.prepareStatement(TOTAL_RESERVATIONS);

    adding_reservations = conn.prepareStatement(ADDING_RESERVATIONS);

    get_reservations = conn.prepareStatement(GET_RESERVATIONS);

    check_balance_and_price = conn.prepareStatement(CHECK_BALANCE_AND_PRICE);

    update_balance = conn.prepareStatement(UPDATE_BALANCE);

    update_paid = conn.prepareStatement(UPDATE_PAID);

    user_amt_of_reservations = conn.prepareStatement(USER_AMT_OF_RESERVATIONS);

    get_user_reservations = conn.prepareStatement(GET_USER_RESERVATIONS);
  }

  /* See QueryAbstract.java for javadoc */
  public String transaction_login(String username, String password) {
    try {
      //Check if user is already logged in
      //Check if username exists
      //Check if password matches

      if (loginCheck != null) {
        return "User already logged in\n";
      }

      login_users.clearParameters();
      login_users.setString(1, username);

      ResultSet result_set = login_users.executeQuery();
      byte[] passwordSalt = null;

      if (result_set.next()) {
        passwordSalt = result_set.getBytes("hashedPassword");
      }
      else {
        result_set.close();
        return "Login failed\n";
      }
      result_set.close();
      if (PasswordUtils.plaintextMatchesSaltedHash(password, passwordSalt)) {
        loginCheck = username;
        if (itineraries != null) {
          itineraries.clear();
        }
        return "Logged in as " + username + "\n";
      }
      else {
        return "Login failed\n";

      }
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    return "Login failed\n";
  }

  /* See QueryAbstract.java for javadoc */
  public String transaction_createCustomer(String username, String password, int initAmount) {
    byte[] hashedPassword = null;
    try {
      //Return error if balance is negative
      if (initAmount < 0) {
        return "Failed to create user\n";
      }
      conn.setAutoCommit(false);

      login_users.clearParameters();
      login_users.setString(1, username);
      ResultSet result_set = login_users.executeQuery();

      if (result_set.next()) {
        result_set.close();
        conn.rollback();
        conn.setAutoCommit(true);
        return "Failed to create user\n";
      }

      result_set.close();
      insert_users.setString(1, username);
      hashedPassword = PasswordUtils.saltAndHashPassword(password);
      insert_users.setBytes(2, hashedPassword);
      insert_users.setInt(3, initAmount);
      insert_users.executeUpdate();
      conn.commit();
      conn.setAutoCommit(true);
    }
    catch (SQLException e) {
      try {
        if (isDeadlock(e)) {
          conn.rollback();
          conn.setAutoCommit(true);
          return transaction_createCustomer(username, password, initAmount);
        }
        else {
          conn.rollback();
          conn.setAutoCommit(true);
        }
        e.printStackTrace();
      }
      catch (SQLException e2) {
        e2.printStackTrace();
      }
      return "Failed to create user\n";
      }
      return "Created user " + username + "\n";
    }

  /* See QueryAbstract.java for javadoc */
  public String transaction_search(String originCity, String destinationCity, 
                                   boolean directFlight, int dayOfMonth,
                                   int numberOfItineraries) {
    // WARNING: the below code is insecure (it's susceptible to SQL injection attacks) AND only
    // handles searches for direct flights.  We are providing it *only* as an example of how
    // to use JDBC; you are required to replace it with your own secure implementation.
    //
    // TODO: YOUR CODE HERE

    StringBuffer sb = new StringBuffer();
    if (itineraries != null) {
      itineraries.clear();
    }
    try {
      if (directFlight) {
        direct_flight_search.clearParameters();
        direct_flight_search.setString(1, originCity);
        direct_flight_search.setString(2, destinationCity);
        direct_flight_search.setInt(3, dayOfMonth);

        ResultSet directFlights = direct_flight_search.executeQuery();


        if (directFlights.next()) {
          List<Integer> list = new ArrayList<>();
          list.add(directFlights.getInt("fid"));
          itineraries.add(list);
          sb.append("Itinerary 0: 1 flight(s), " + directFlights.getInt("actual_time") + " minutes\n");
          sb.append("ID: " + directFlights.getInt("fid") + " Day: " + directFlights.getInt("day_of_month")
                    + " Carrier: " + directFlights.getString("carrier_id") + " Number: " + directFlights.getInt("flight_num")
                    + " Origin: " + directFlights.getString("origin_city") + " Dest: " + directFlights.getString("dest_city") 
                    + " Duration: " + directFlights.getInt("actual_time") + " Capacity: " + directFlights.getInt("capacity")
                    + " Price: " + directFlights.getInt("price") + "\n");
        }
        else {
          directFlights.close();
          return "No flights match your selection\n";
        }

        int itineraryNumber = 1;
        while (directFlights.next() && (itineraryNumber < numberOfItineraries)) {
          List<Integer> list = new ArrayList<>();
          list.add(directFlights.getInt("fid"));
          itineraries.add(list);
          sb.append("Itinerary " + itineraryNumber + ": 1 flight(s), " + directFlights.getInt("actual_time") + " minutes\n");
          sb.append("ID: " + directFlights.getInt("fid") + " Day: " + directFlights.getInt("day_of_month")
                    + " Carrier: " + directFlights.getString("carrier_id") + " Number: " + directFlights.getInt("flight_num")
                    + " Origin: " + directFlights.getString("origin_city") + " Dest: " + directFlights.getString("dest_city") 
                    + " Duration: " + directFlights.getInt("actual_time") + " Capacity: " + directFlights.getInt("capacity")
                    + " Price: " + directFlights.getInt("price") + "\n");
          itineraryNumber++;
        }
        directFlights.close();
      }
      else {
        //Check to see if num of direct flights is less than wanted itinteraries
        //Because then just return the direct flights
        //Otherwise call other query and return that for how many ever interaries are needed
        direct_flight_search.clearParameters();
        direct_flight_search.setString(1, originCity);
        direct_flight_search.setString(2, destinationCity);
        direct_flight_search.setInt(3, dayOfMonth);

        ResultSet directFlights = direct_flight_search.executeQuery();

        int numOfFlights = 0;
        while (directFlights.next()) {
          numOfFlights++;
        }
        directFlights.close();

        if (numberOfItineraries <= numOfFlights) {
          direct_flight_search.clearParameters();
          direct_flight_search.setString(1, originCity);
          direct_flight_search.setString(2, destinationCity);
          direct_flight_search.setInt(3, dayOfMonth);

          ResultSet flights = direct_flight_search.executeQuery();
          
          int itineraryNumber = 0;
          while (flights.next() && (itineraryNumber < numberOfItineraries)) {
          List<Integer> list = new ArrayList<>();
          list.add(flights.getInt("fid"));
          itineraries.add(list);
            sb.append("Itinerary " + itineraryNumber + ": 1 flight(s), " + flights.getInt("actual_time") + " minutes\n");
            sb.append("ID: " + flights.getInt("fid") + " Day: " + flights.getInt("day_of_month")
                    + " Carrier: " + flights.getString("carrier_id") + " Number: " + flights.getInt("flight_num")
                    + " Origin: " + flights.getString("origin_city") + " Dest: " + flights.getString("dest_city") 
                    + " Duration: " + flights.getInt("actual_time") + " Capacity: " + flights.getInt("capacity")
                    + " Price: " + flights.getInt("price") + "\n");
            itineraryNumber++; 
          }
          flights.close();
        }
        else { //we need to consider indirect flights as well
          indirect_flight_search.clearParameters();
          indirect_flight_search.setInt(1, numOfFlights);
          indirect_flight_search.setString(2, originCity);
          indirect_flight_search.setString(3, destinationCity);
          indirect_flight_search.setInt(4, dayOfMonth);
          indirect_flight_search.setInt(5, numberOfItineraries - numOfFlights);
          indirect_flight_search.setString(6, originCity);
          indirect_flight_search.setString(7, destinationCity);
          indirect_flight_search.setInt(8, dayOfMonth);

          ResultSet indirectFlights = indirect_flight_search.executeQuery();

          if (indirectFlights.next()) {
            if (indirectFlights.getObject("second_fid") == null) {
              List<Integer> list = new ArrayList<>();
              list.add(indirectFlights.getInt("first_fid"));
              itineraries.add(list);
              sb.append("Itinerary 0: 1 flight(s), " + indirectFlights.getInt("total_flight_time") + " minutes\n");
              sb.append("ID: " + indirectFlights.getInt("first_fid") + " Day: " + indirectFlights.getInt("first_day_of_month")
                    + " Carrier: " + indirectFlights.getString("first_carrier_id") + " Number: " + indirectFlights.getInt("first_flight_num")
                    + " Origin: " + indirectFlights.getString("first_origin_city") + " Dest: " + indirectFlights.getString("first_dest_city") 
                    + " Duration: " + indirectFlights.getInt("total_flight_time") + " Capacity: " + indirectFlights.getInt("first_capacity")
                    + " Price: " + indirectFlights.getInt("first_price") + "\n");
            }
            else {
              List<Integer> list = new ArrayList<>();
              list.add(indirectFlights.getInt("first_fid"));
              list.add(indirectFlights.getInt("second_fid"));
              itineraries.add(list);
              sb.append("Itinerary 0: 2 flight(s), " + indirectFlights.getInt("total_flight_time") + " minutes\n");
              sb.append("ID: " + indirectFlights.getInt("first_fid") + " Day: " + indirectFlights.getInt("first_day_of_month")
                    + " Carrier: " + indirectFlights.getString("first_carrier_id") + " Number: " + indirectFlights.getInt("first_flight_num")
                    + " Origin: " + indirectFlights.getString("first_origin_city") + " Dest: " + indirectFlights.getString("first_dest_city") 
                    + " Duration: " + indirectFlights.getInt("first_actual_time") + " Capacity: " + indirectFlights.getInt("first_capacity")
                    + " Price: " + indirectFlights.getInt("first_price") + "\n");
              sb.append("ID: " + indirectFlights.getInt("second_fid") + " Day: " + indirectFlights.getInt("second_day_of_month")
                    + " Carrier: " + indirectFlights.getString("second_carrier_id") + " Number: " + indirectFlights.getInt("second_flight_num")
                    + " Origin: " + indirectFlights.getString("second_origin_city") + " Dest: " + indirectFlights.getString("second_dest_city") 
                    + " Duration: " + indirectFlights.getInt("second_actual_time") + " Capacity: " + indirectFlights.getInt("second_capacity")
                    + " Price: " + indirectFlights.getInt("second_price") + "\n");
            }   
            int itineraryNumber = 1;
            while (indirectFlights.next() && (itineraryNumber < numberOfItineraries)) {
              if (indirectFlights.getString("second_fid") == null) {
              List<Integer> list = new ArrayList<>();
              list.add(indirectFlights.getInt("first_fid")); 
              itineraries.add(list);               
                sb.append("Itinerary " + itineraryNumber + ": 1 flight(s), " + indirectFlights.getInt("total_flight_time") + " minutes\n");
                sb.append("ID: " + indirectFlights.getInt("first_fid") + " Day: " + indirectFlights.getInt("first_day_of_month")
                    + " Carrier: " + indirectFlights.getString("first_carrier_id") + " Number: " + indirectFlights.getInt("first_flight_num")
                    + " Origin: " + indirectFlights.getString("first_origin_city") + " Dest: " + indirectFlights.getString("first_dest_city") 
                    + " Duration: " + indirectFlights.getInt("total_flight_time") + " Capacity: " + indirectFlights.getInt("first_capacity")
                    + " Price: " + indirectFlights.getInt("first_price") + "\n");
              }
              else {
              List<Integer> list = new ArrayList<>();
              list.add(indirectFlights.getInt("first_fid"));
              list.add(indirectFlights.getInt("second_fid"));
              itineraries.add(list);                
                sb.append("Itinerary " + itineraryNumber + ": 2 flight(s), " + indirectFlights.getInt("total_flight_time") + " minutes\n");
                sb.append("ID: " + indirectFlights.getInt("first_fid") + " Day: " + indirectFlights.getInt("first_day_of_month")
                    + " Carrier: " + indirectFlights.getString("first_carrier_id") + " Number: " + indirectFlights.getInt("first_flight_num")
                    + " Origin: " + indirectFlights.getString("first_origin_city") + " Dest: " + indirectFlights.getString("first_dest_city") 
                    + " Duration: " + indirectFlights.getInt("first_actual_time") + " Capacity: " + indirectFlights.getInt("first_capacity")
                    + " Price: " + indirectFlights.getInt("first_price") + "\n");
                sb.append("ID: " + indirectFlights.getInt("second_fid") + " Day: " + indirectFlights.getInt("second_day_of_month")
                    + " Carrier: " + indirectFlights.getString("second_carrier_id") + " Number: " + indirectFlights.getInt("second_flight_num")
                    + " Origin: " + indirectFlights.getString("second_origin_city") + " Dest: " + indirectFlights.getString("second_dest_city") 
                    + " Duration: " + indirectFlights.getInt("second_actual_time") + " Capacity: " + indirectFlights.getInt("second_capacity")
                    + " Price: " + indirectFlights.getInt("second_price") + "\n");
              }
              itineraryNumber++;
            }
          }
          else {
            return "No flights match your selection\n";
          }
          indirectFlights.close();
        }    
      }
    }
    catch (SQLException e) {
      e.printStackTrace();
      return "Failed to search\n";
    }
    return sb.toString();
  }

  /* See QueryAbstract.java for javadoc */
  public String transaction_book(int itineraryId) {
    int resID = 0;
    try {
      conn.setAutoCommit(false);
      //Make sure someone is logged in
      if (loginCheck == null) {
        conn.rollback();
        conn.setAutoCommit(true);
        return "Cannot book reservations, not logged in\n";
      }
      
      //Make sure there was a recent search done after being logged in
      //And just that the itinerary id is valid and is one of the ones from that recent search
      if (itineraries.size() == 0 || itineraryId < 0 || itineraryId >= itineraries.size()) {
        conn.rollback();
        conn.setAutoCommit(true);
        return "No such itinerary " + itineraryId + "\n";
      }

      //Check if it's on the same day as an already reserved flight
      get_reserved_flight_dates.clearParameters();
      get_reserved_flight_dates.setString(1, loginCheck);
      ResultSet reservedFlightDates = get_reserved_flight_dates.executeQuery();
      
      get_flight_date.clearParameters();
      int fidOfChosenFlight = itineraries.get(itineraryId).get(0);
      get_flight_date.setInt(1, fidOfChosenFlight);
      ResultSet chosenFlightDate = get_flight_date.executeQuery();
      chosenFlightDate.next();

      while (reservedFlightDates.next()) {
        if ((reservedFlightDates.getInt("day") == chosenFlightDate.getInt("day"))) {
            chosenFlightDate.close();
            reservedFlightDates.close();
            conn.rollback();
            conn.setAutoCommit(true);
            return "You cannot book two flights in the same day\n";
        }
      }
      chosenFlightDate.close();
      reservedFlightDates.close();


      if (!atCapacity(itineraryId)) {
      //Now we know that everything is valid and can actually book the flight
      //Get the resID by taking the number of things in the table and adding 1
        total_reservations.clearParameters();
        ResultSet resIDCurrentMax = total_reservations.executeQuery();
        resIDCurrentMax.next();
        resID = resIDCurrentMax.getInt("TotalReservations") + 1;
        resIDCurrentMax.close();

        //Insert the reservation into reservation table
        adding_reservations.clearParameters();
        adding_reservations.setInt(1, resID);
        adding_reservations.setString(2, loginCheck);  
        adding_reservations.setInt(3, itineraries.get(itineraryId).get(0));
        if (itineraries.get(itineraryId).size() > 1) {
          int secondFlightFid = itineraries.get(itineraryId).get(1);
          adding_reservations.setInt(4, secondFlightFid);
        }
        else {
          adding_reservations.setNull(4, java.sql.Types.INTEGER);
        }
        adding_reservations.executeUpdate();
        conn.commit();
        conn.setAutoCommit(true);
        return "Booked flight(s), reservation ID: " + resID + "\n";
      }
      conn.rollback();
      conn.setAutoCommit(true);
      return "Booking failed\n";

    }
    catch (SQLException e) {
      try {
        conn.rollback();
        conn.setAutoCommit(true);
        if (isDeadlock(e)) {
          return transaction_book(itineraryId);
        }
      }
      catch (SQLException e2) {
        e2.printStackTrace();
      }
      e.printStackTrace();
      return "Booking failed\n";
    }
  }

  private boolean atCapacity(int itineraryId) {
      // //Make sure there is capacity on the flight (both flights if not a direct flight)
      try {
        int fidOfChosenFlight = itineraries.get(itineraryId).get(0);
        reservation_count.clearParameters();
        reservation_count.setInt(1, fidOfChosenFlight);
        ResultSet numOfReservations = reservation_count.executeQuery();

        get_flight_capacity.clearParameters();
        get_flight_capacity.setInt(1, fidOfChosenFlight);
        ResultSet flightCapacity = get_flight_capacity.executeQuery();

        numOfReservations.next();
        flightCapacity.next();

        if (flightCapacity.getInt("capacity") - numOfReservations.getInt("TotalBookings") <= 0) {
          numOfReservations.close();
          flightCapacity.close();
          return true;
        }
        numOfReservations.close();
        flightCapacity.close();

        if (itineraries.get(itineraryId).size() > 1) {
          fidOfChosenFlight = itineraries.get(itineraryId).get(1);
          reservation_count.clearParameters();
          reservation_count.setInt(1, fidOfChosenFlight);
          ResultSet reservations = reservation_count.executeQuery();

          get_flight_capacity.clearParameters();
          get_flight_capacity.setInt(1, fidOfChosenFlight);
          ResultSet capacity = get_flight_capacity.executeQuery();

          reservations.next();
          capacity.next();

          if (capacity.getInt("capacity") - reservations.getInt("TotalBookings") <= 0) {
            reservations.close();
            capacity.close();
            conn.rollback();
            conn.setAutoCommit(true);
            return true;
          }
          reservations.close();
          capacity.close();
        }
        return false;
      } 
      catch (SQLException e) {
        e.printStackTrace();
        return false;
      }
  }
  /* See QueryAbstract.java for javadoc */
  public String transaction_pay(int reservationId) {
    //If not logged in then should return an error
    try {
      conn.setAutoCommit(false);
      if (loginCheck == null) {
        conn.rollback();
        conn.setAutoCommit(true);
        return "Cannot pay, not logged in\n";
      }

      //If its an invalid id or if its found but already paid for it should return an error
      //To check for invalid id, the resID has to be <= total reservations

      total_reservations.clearParameters();
      ResultSet reservations = total_reservations.executeQuery();
      reservations.next();
      int amountOfReservations = reservations.getInt("TotalReservations");
      reservations.close();

      if (reservationId < 1 || reservationId > amountOfReservations) {
        conn.rollback();
        conn.setAutoCommit(true);
        return  "Cannot find unpaid reservation " + reservationId + " under user: " + loginCheck + "\n";
      }

      get_reservations.clearParameters();
      get_reservations.setInt(1, reservationId);
      ResultSet reservation = get_reservations.executeQuery();
      reservation.next();

      if (!(reservation.getString("username").equals(loginCheck)) || reservation.getInt("paid") == 1) {
        reservation.close();
        conn.rollback();
        conn.setAutoCommit(true);
        return  "Cannot find unpaid reservation " + reservationId + " under user: " + loginCheck + "\n";
      }
      reservation.close();
    
      //If the user doesn't have enough money to pay for the flight then should also return error
      check_balance_and_price.clearParameters();
      check_balance_and_price.setInt(1, reservationId);
      ResultSet balance = check_balance_and_price.executeQuery();
      balance.next();

      int money = balance.getInt("balance");
      int price = balance.getInt("price_fid1");
      if (balance.getObject("price_fid2") != null) {
        price += balance.getInt("price_fid2");
      }
      balance.close();
      if (money < price) {
        conn.rollback();
        conn.setAutoCommit(true);
        return "User has only " + money + " in account but itinerary costs " + price + "\n";
      }

      //Otherwise its succesful and should update the reservation paid field 
      //And should update how much money is in the user's balance in user's table
      update_paid.clearParameters();
      update_paid.setInt(1, reservationId);
      update_paid.executeUpdate();
    
      update_balance.clearParameters();
      int newBalance = money - price;
      update_balance.setInt(1, newBalance);
      update_balance.setString(2, loginCheck);
      update_balance.executeUpdate();

      conn.commit();
      conn.setAutoCommit(true);

      return "Paid reservation: " + reservationId +  " remaining balance: " + newBalance + "\n";
    }
    catch (SQLException e) {
      try {
        conn.rollback();
        conn.setAutoCommit(true);
        if (isDeadlock(e)) {
          return transaction_pay(reservationId);
        }
        e.printStackTrace();
      }
      catch (SQLException e2) {
        e2.printStackTrace();
      }
      e.printStackTrace();
      return "Failed to pay for reservation " + reservationId + "\n";
    }
  }

  /* See QueryAbstract.java for javadoc */
  public String transaction_reservations() {
    // TODO: YOUR CODE HERE
    try {
      //If not logged in then return error
      if (loginCheck == null) {
        return "Cannot view reservations, not logged in\n";
      }

      //If the user that's logged in has no reservations then return error
      user_amt_of_reservations.clearParameters();
      user_amt_of_reservations.setString(1, loginCheck);
      ResultSet numOfReservations = user_amt_of_reservations.executeQuery();
      numOfReservations.next();
      if (numOfReservations.getInt("num_reservations") == 0) {
        numOfReservations.close();
        return "No reservations found\n";
      }
      numOfReservations.close();
      
      //Okay so now we have to get all the reservations
      StringBuffer sb = new StringBuffer();
      get_user_reservations.clearParameters();
      get_user_reservations.setString(1, loginCheck);
      ResultSet reservations = get_user_reservations.executeQuery();

      while (reservations.next()) {
        boolean isPaid = false;
        if (reservations.getInt("paid") == 1) {
          isPaid = true;
        }
        sb.append("Reservation " + reservations.getInt("id") + " paid: " + isPaid + ":\n");
        sb.append("ID: " + reservations.getInt("flight1_id") + " Day: " + reservations.getInt("flight1_day"));
        sb.append(" Carrier: " + reservations.getString("flight1_carrier") + " Number: " + reservations.getInt("flight1_num"));
        sb.append(" Origin: " + reservations.getString("flight1_origin") + " Dest: " + reservations.getString("flight1_dest"));
        sb.append(" Duration: " + reservations.getInt("flight1_duration") + " Capacity: " + reservations.getInt("flight1_capacity"));
        sb.append(" Price: " + reservations.getInt("flight1_price") + "\n");
        if (reservations.getObject("flight2_id") != null) {
        sb.append("ID: " + reservations.getInt("flight2_id") + " Day: " + reservations.getInt("flight2_day"));
        sb.append(" Carrier: " + reservations.getString("flight2_carrier") + " Number: " + reservations.getInt("flight2_num"));
        sb.append(" Origin: " + reservations.getString("flight2_origin") + " Dest: " + reservations.getString("flight2_dest"));
        sb.append(" Duration: " + reservations.getInt("flight2_duration") + " Capacity: " + reservations.getInt("flight2_capacity"));          
        }
      }
      return sb.toString();


    }
    catch (SQLException e) {
      e.printStackTrace();
    }
    return "Failed to retrieve reservations\n";
  }

  /**
   * Example utility function that uses prepared statements
   */
  private int checkFlightCapacity(int fid) throws SQLException {
    flightCapacityStmt.clearParameters();
    flightCapacityStmt.setInt(1, fid);

    ResultSet results = flightCapacityStmt.executeQuery();
    results.next();
    int capacity = results.getInt("capacity");
    results.close();

    return capacity;
  }

  /**
   * Utility function to determine whether an error was caused by a deadlock
   */
  private static boolean isDeadlock(SQLException e) {
    return e.getErrorCode() == 1205;
  }

  /**
   * A class to store information about a single flight
   *
   * TODO(hctang): move this into QueryAbstract
   */
  class Flight {
    public int fid;
    public int dayOfMonth;
    public String carrierId;
    public String flightNum;
    public String originCity;
    public String destCity;
    public int time;
    public int capacity;
    public int price;

    Flight(int id, int day, String carrier, String fnum, String origin, String dest, int tm,
           int cap, int pri) {
      fid = id;
      dayOfMonth = day;
      carrierId = carrier;
      flightNum = fnum;
      originCity = origin;
      destCity = dest;
      time = tm;
      capacity = cap;
      price = pri;
    }
    
    @Override
    public String toString() {
      return "ID: " + fid + " Day: " + dayOfMonth + " Carrier: " + carrierId + " Number: "
          + flightNum + " Origin: " + originCity + " Dest: " + destCity + " Duration: " + time
          + " Capacity: " + capacity + " Price: " + price;
    }
  }
}
