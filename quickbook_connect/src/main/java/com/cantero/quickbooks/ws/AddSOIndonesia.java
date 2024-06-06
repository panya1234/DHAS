package com.cantero.quickbooks.ws;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.HashMap;

import javax.jws.WebService;

import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;
import com.opencsv.exceptions.CsvException;

import java.io.File;
import java.io.FileReader;
import java.util.List;
import java.util.Map;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.CSVWriter;
import com.opencsv.CSVWriterBuilder;

/*
 * http://developer.intuit.com/qbsdk-current/doc/pdf/qbwc_proguide.pdf
 */
@SuppressWarnings("unused")
@WebService(endpointInterface = "com.cantero.quickbooks.ws.QBWebConnectorSvcSoap")
public class AddSOIndonesia implements QBWebConnectorSvcSoap {


    @Override
    public ArrayOfString authenticate(String strUserName, String strPassword) {
        ArrayOfString arr = new ArrayOfString();
        arr.string = new ArrayList<String>();
        arr.string.add("The first element is a token for the web connector s session");
        arr.string.add(""); //To use the currently open company, specify an empty string
        return arr;
    }

    @Override
    public String closeConnection(String ticket) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String connectionError(String ticket, String hresult, String message) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getLastError(String ticket) {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * @return A positive integer less than 100 represents the percentage of work completed. A value of 1 means one percent complete, a value of 100 means 100 percent complete--there is no more work. A negative value means an error has occurred and the Web Connector responds to this with a getLastError call. The negative value could be used as a custom error code.
     */
    @Override
    public int receiveResponseXML(String ticket, String response, String hresult, String message) {
        final String FILE_PATH = "CSV/WRITE/Orders/Indonesia/ordersIN.csv";
        final String LINE_ITEMS_FILE_PATH = "CSV/WRITE/Orders/Indonesia/orderItemsIN.csv";
        final String ERROR_FILE_PATH = "CSV/READ/errorOrders.csv";
        // final String ERROR_LINE_ITEMS_FILE_PATH = "C:/DHAS/dhas_nodejs/CSV/WRITE/Orders/Error/OrderItemLogsPH.csv";

        try (CSVReader readerSO = new CSVReader(new FileReader(FILE_PATH));
             CSVReader readerSOItems = new CSVReader(new FileReader(LINE_ITEMS_FILE_PATH))){
            List<String[]> allRows = readerSO.readAll();
            List<String[]> allItemRows = readerSOItems.readAll();

            readerSO.skip(1);
            readerSOItems.skip(1);

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new InputSource(new StringReader(response)));
            NodeList salesOrderAddRs = document.getElementsByTagName("SalesOrderAddRs");

            for (int i = 0; i < salesOrderAddRs.getLength(); i++) {
                Element element = (Element) salesOrderAddRs.item(i);
                String statusSeverity = element.getAttribute("statusSeverity");

                if (statusSeverity.contains("Info")) {
                    String refNumber = element.getElementsByTagName("RefNumber").item(0).getTextContent();
                    System.out.println(refNumber);
                    String orderId = "";
                    for (int j = 0; j < allRows.size(); j++) {
                        String[] row = allRows.get(j);
                        if (row.length > 0 && row[2].equals(refNumber)) { 
                            orderId = row[0];
                            allRows.remove(j);
                            break; 
                        }
                    }
                    for (int k = 0; k < allItemRows.size(); k++) {
                        String[] row = allItemRows.get(k);
                        if (row.length > 0 && row[0].equals(orderId)) { 
                            allItemRows.remove(k);
                            k--; 
                        }
                    }
        
                    CSVWriter writerOrders = new CSVWriter(new FileWriter(FILE_PATH), ',', CSVWriter.NO_QUOTE_CHARACTER, CSVWriter.NO_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);
                    writerOrders.writeAll(allRows);
                    writerOrders.close();

                    CSVWriter writerItems = new CSVWriter(new FileWriter(LINE_ITEMS_FILE_PATH), ',', CSVWriter.NO_QUOTE_CHARACTER, CSVWriter.NO_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);
                    writerItems.writeAll(allItemRows);
                    writerItems.close();
                } else {
                    Element salesOrderAddElement = (Element) salesOrderAddRs.item(0);
                    String statusMessage = salesOrderAddElement.getAttribute("statusMessage");
                    // System.out.println("Status Message: " + statusMessage);
                    String statusMessageRow = statusMessage;

                    ArrayList<String[]> deletedRows = new ArrayList<>();
                    ArrayList<String[]> deletedItemRows = new ArrayList<>();

                    String orderId = "";
                    DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");  
                    LocalDate now = LocalDate.now();  
                    Iterator<String[]> iterator = allRows.iterator();
                    if (iterator.hasNext()) {
                        iterator.next();
                    }
                    while (iterator.hasNext()) {
                        String[] row = iterator.next();
                        orderId = row[0];
                        iterator.remove();
                        row = Arrays.copyOf(row, row.length + 2);
                        row[row.length - 2] = statusMessage;
                        row[row.length - 1] = dtf.format(now);
                        deletedRows.add(row);
                        break;
                    }
                    
                    for (int k = 0; k < allItemRows.size(); k++) {
                        String[] row = allItemRows.get(k);
                        if (row.length > 0 && row[0].equals(orderId)) {
                            row[4] = row[4] + "," + statusMessage;
                            deletedItemRows.add(row); 
                            allItemRows.remove(k);
                            k--;
                        }
                    }

                    CSVWriter writerOrders = new CSVWriter(new FileWriter(FILE_PATH), ',', CSVWriter.NO_QUOTE_CHARACTER, CSVWriter.NO_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);
                    writerOrders.writeAll(allRows);
                    writerOrders.close();

                    CSVWriter writerItems = new CSVWriter(new FileWriter(LINE_ITEMS_FILE_PATH), ',', CSVWriter.NO_QUOTE_CHARACTER, CSVWriter.NO_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);
                    writerItems.writeAll(allItemRows);
                    writerItems.close();

                    CSVWriter writerDeletedOrders = new CSVWriter(new FileWriter(ERROR_FILE_PATH, true)); // ใช้โหมด append โดยระบุ true
                    if (new File(ERROR_FILE_PATH).length() > 0) { // เช็คว่าไฟล์มีข้อมูลอยู่แล้วหรือไม่
                        writerDeletedOrders.writeAll(deletedRows);
                    } else {
                        writerDeletedOrders.writeNext(new String[]{"soId", "accountName", "qbSalesOrder", "errorReason", "errorDate"});
                        writerDeletedOrders.writeAll(deletedRows);
                    }
                    writerDeletedOrders.close();

                    // CSVWriter writerDeletedItems = new CSVWriter(new FileWriter(ERROR_LINE_ITEMS_FILE_PATH), ',', CSVWriter.NO_QUOTE_CHARACTER, CSVWriter.NO_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);
                    // writerDeletedItems.writeAll(deletedItemRows);
                    // writerDeletedItems.close();
                    System.out.println("Updated Logs: " + ERROR_FILE_PATH);
                }
                System.out.println("Status Severity: " + statusSeverity);
                System.out.println("Updated CSV: " + FILE_PATH + LINE_ITEMS_FILE_PATH);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return -1; 
        }

        // System.out.println(response);
        return 100;
    }

    @Override
    public String sendRequestXML(String ticket, String strHCPResponse,
                                 String strCompanyFileName, String qbXMLCountry, int qbXMLMajorVers,
                                 int qbXMLMinorVers) {

        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"7.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\">");
        final String SO_FILE_PATH = "CSV/WRITE/Orders/Indonesia/ordersIN.csv";
        final String SO_LINE_ITEMS_FILE_PATH = "CSV/WRITE/Orders/Indonesia/orderItemsIN.csv";


        try (CSVReader readerSO = new CSVReader(new FileReader(SO_FILE_PATH));
             CSVReader readerSOItems = new CSVReader(new FileReader(SO_LINE_ITEMS_FILE_PATH))) {
            
            List<String[]> allItemRows = readerSOItems.readAll();

            readerSO.skip(1);
            readerSOItems.skip(1);


            String[] line = readerSO.readNext();
            String sOItemId = line[0];
            String customerName = line[1];
            String SOnumber = line[2];

            queryBuilder.append("<SalesOrderAddRq requestID=\"2\">");
            queryBuilder.append("<SalesOrderAdd>");
            queryBuilder.append("<CustomerRef><FullName>").append(customerName).append("</FullName></CustomerRef>");
            queryBuilder.append("<TemplateRef><FullName>SALES ORDER</FullName></TemplateRef>");
            queryBuilder.append("<RefNumber>").append(SOnumber).append("</RefNumber>");
            
            for (int k = 0; k < allItemRows.size(); k++) {
                String[] row = allItemRows.get(k);
                if (row.length > 0 && row[0].equals(sOItemId)) { 
                    String itemName = row[1];
                    String quantity = row[3];
                    String unitPrice = row[5];
                    String listPrice = row[6];

                    // String salesUM = lineItem[4];

                    queryBuilder.append("<SalesOrderLineAdd>");
                    queryBuilder.append("<ItemRef><FullName>").append(itemName).append("</FullName></ItemRef>");
                    queryBuilder.append("<Quantity>").append(quantity).append("</Quantity>");
                    queryBuilder.append("<Rate>").append(unitPrice).append("</Rate>");
                    queryBuilder.append("<Amount>").append(listPrice).append("</Amount>");
                    // queryBuilder.append("<UnitOfMeasureSetRef><FullName>").append(salesUM).append("</FullName></UnitOfMeasureSetRef>");
                    queryBuilder.append("</SalesOrderLineAdd>");
                }
            }

            queryBuilder.append("</SalesOrderAdd>");
            queryBuilder.append("</SalesOrderAddRq>");
        } catch (IOException | CsvException e) {
            e.printStackTrace();
            return "Error generating XML request: " + e.getMessage();
        }

        queryBuilder.append("</QBXMLMsgsRq></QBXML>");
        // System.out.println(queryBuilder.toString());
        return queryBuilder.toString();
    }

}
