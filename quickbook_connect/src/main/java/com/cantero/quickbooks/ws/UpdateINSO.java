package com.cantero.quickbooks.ws;

import java.util.ArrayList;

import javax.jws.WebService;

import java.io.FileWriter;
import java.io.StringReader;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;


import java.io.FileReader;
import java.util.List;

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;

/*
 * http://developer.intuit.com/qbsdk-current/doc/pdf/qbwc_proguide.pdf
 */
@WebService(endpointInterface = "com.cantero.quickbooks.ws.QBWebConnectorSvcSoap")
public class UpdateINSO implements QBWebConnectorSvcSoap {


    @Override
    public ArrayOfString authenticate(String strUserName, String strPassword) {
        ArrayOfString arr = new ArrayOfString();
        arr.string = new ArrayList<String>();
        arr.string.add("The first element is a token for the web connector�s session");
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
    public int receiveResponseXML(String ticket,
                                  String response,
                                  String hresult, String message) {
        // TODO Auto-generated method stub
        System.out.println(response);

        final String FILE_CANCAL_PATH = "CSV/WRITE/CancelOrders/Indonesia/cancelOrdersIN.csv";
        try (CSVReader readerCancelSO = new CSVReader(new FileReader(FILE_CANCAL_PATH))){
            List<String[]> allRows = readerCancelSO.readAll();
            readerCancelSO.skip(1);
            
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new InputSource(new StringReader(response)));
            NodeList salesOrderAddRs = document.getElementsByTagName("SalesOrderModRs");

            for (int i = 0; i < salesOrderAddRs.getLength(); i++) {
                Element element = (Element) salesOrderAddRs.item(i);
                String statusSeverity = element.getAttribute("statusSeverity");

                if (statusSeverity.contains("Info")) {
                    String refNumber = element.getElementsByTagName("RefNumber").item(0).getTextContent();
                    for (int j = 0; j < allRows.size(); j++) {
                        String[] row = allRows.get(j);
                        if (row.length > 0 && row[2].equals(refNumber)) { 
                            allRows.remove(j);
                            break; 
                        }
                    }
                    CSVWriter writerOrders = new CSVWriter(new FileWriter(FILE_CANCAL_PATH));
                    writerOrders.writeAll(allRows);
                    writerOrders.close();   
                } else {
                    if (allRows.size() > 2) {
                        String[] rowAfterHeader = allRows.remove(1);
                        allRows.add(rowAfterHeader);
                    }
                    CSVWriter writerOrders = new CSVWriter(new FileWriter(FILE_CANCAL_PATH));
                    writerOrders.writeAll(allRows);
                    writerOrders.close();
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
            return -1; 
        }
        return 100;
    }

    @Override
    public String sendRequestXML(String ticket, String strHCPResponse,
                                 String strCompanyFileName, String qbXMLCountry, int qbXMLMajorVers,
                                 int qbXMLMinorVers) {
        //Example qbXML to Query for an Item
        //http://www.consolibyte.com/wiki/doku.php/quickbooks_qbxml_itemquery

        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"13.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\">");
        final String FILE_CANCAL_PATH = "CSV/WRITE/CancelOrders/Indonesia/cancelOrdersIN.csv";
        try (CSVReader readerCancelSO = new CSVReader(new FileReader(FILE_CANCAL_PATH))){
            readerCancelSO.skip(1);

            String[] line = readerCancelSO.readNext();
            String txnID = line[4];
            String editSequence = line[5];
            queryBuilder.append("<SalesOrderModRq><SalesOrderMod>");
            queryBuilder.append("<TxnID>").append(txnID).append("</TxnID>");
            queryBuilder.append("<EditSequence>").append(editSequence).append("</EditSequence>");
            queryBuilder.append("<IsManuallyClosed>true</IsManuallyClosed>");
            queryBuilder.append("</SalesOrderMod></SalesOrderModRq></QBXMLMsgsRq></QBXML>");
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating XML request: " + e.getMessage();
        }

        // String query = "<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"13.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\"><SalesOrderModRq><SalesOrderMod><TxnID>495-1718624050</TxnID><EditSequence>1720287909</EditSequence><IsManuallyClosed>true</IsManuallyClosed></SalesOrderMod></SalesOrderModRq></QBXMLMsgsRq></QBXML>";
        // String query = "<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"13.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\"><SalesOrderQueryRq><RefNumber>SF24060052</RefNumber></SalesOrderQueryRq></QBXMLMsgsRq></QBXML>";
        System.out.println(queryBuilder);
        return queryBuilder.toString();        
    }

}
