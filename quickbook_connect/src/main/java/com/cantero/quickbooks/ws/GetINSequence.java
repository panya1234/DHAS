package com.cantero.quickbooks.ws;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import javax.jws.WebService;

import java.io.FileWriter;
import java.io.StringReader;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;


import java.io.File;
import java.io.FileReader;
import java.util.List;

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;

/*
 * http://developer.intuit.com/qbsdk-current/doc/pdf/qbwc_proguide.pdf
 */
@WebService(endpointInterface = "com.cantero.quickbooks.ws.QBWebConnectorSvcSoap")
public class GetINSequence implements QBWebConnectorSvcSoap {


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
        // System.out.println(response);

        final String FILE_CANCAL_PATH = "CSV/WRITE/CancelOrders/Indonesia/cancelOrdersIN.csv";
        try (CSVReader readerCancelSO = new CSVReader(new FileReader(FILE_CANCAL_PATH))){
            List<String[]> allRows = readerCancelSO.readAll();
            readerCancelSO.skip(1);
            ArrayList<String[]> editRows = new ArrayList<>();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            InputSource res = new InputSource(new StringReader(response));
            Document document = builder.parse(res);
            NodeList soList = document.getElementsByTagName("SalesOrderRet");
            String txnID = "";
            String editSequence = "";
            String refNumber = "";
            for (int i = 0; i < soList.getLength(); i++) {
                Element so = (Element) soList.item(i);
                txnID = so.getElementsByTagName("TxnID").item(0).getTextContent();
                editSequence = so.getElementsByTagName("EditSequence").item(0).getTextContent();
                refNumber = so.getElementsByTagName("RefNumber").item(0).getTextContent();
            }
            Iterator<String[]> iterator = allRows.iterator();
            if (iterator.hasNext()) {
                iterator.next();
            }
            while (iterator.hasNext()) {
                String[] row = iterator.next();
                iterator.remove();
                if (row[2].equals(refNumber)) {
                    row = Arrays.copyOf(row, row.length + 2);
                    row[row.length - 2] = txnID;
                    row[row.length - 1] = editSequence;
                }
                editRows.add(row);
            }
           
            CSVWriter writerDeletedOrders = new CSVWriter(new FileWriter(FILE_CANCAL_PATH)); 
            if (new File(FILE_CANCAL_PATH).length() > 0) { 
                writerDeletedOrders.writeAll(editRows);
            } else {
                writerDeletedOrders.writeNext(new String[]{"Order Id","QBListID","QBSales Order","Status","TxnID","EditSequence"});
                writerDeletedOrders.writeAll(editRows);
            }
            writerDeletedOrders.close();

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
        final String FILE_CANCAL_PATH = "C:/Users/panya/Downloads/DHAS/DHAS/dhas_nodejs/CSV/WRITE/CancelOrders/Indonesia/cancelOrdersIN.csv";
        try (CSVReader readerCancelSO = new CSVReader(new FileReader(FILE_CANCAL_PATH))){
            readerCancelSO.skip(1);

            String[] line = readerCancelSO.readNext();
            String SOnumber = line[2];
            queryBuilder.append("<SalesOrderQueryRq>");
            queryBuilder.append("<RefNumber>").append(SOnumber).append("</RefNumber>");
            queryBuilder.append("</SalesOrderQueryRq></QBXMLMsgsRq></QBXML>");
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating XML request: " + e.getMessage();
        }


        // String query = "<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"13.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\"><SalesOrderModRq><SalesOrderMod><TxnID>495-1718624050</TxnID><EditSequence>1720287909</EditSequence><IsManuallyClosed>true</IsManuallyClosed></SalesOrderMod></SalesOrderModRq></QBXMLMsgsRq></QBXML>";
        // String query = "<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"13.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\"><SalesOrderQueryRq><RefNumber>SF24060052</RefNumber></SalesOrderQueryRq></QBXMLMsgsRq></QBXML>";
        // System.out.println(queryBuilder);
        return queryBuilder.toString();
    }

}
