package com.cantero.quickbooks.ws;

import java.util.ArrayList;

import javax.jws.WebService;

/*
 * http://developer.intuit.com/qbsdk-current/doc/pdf/qbwc_proguide.pdf
 */
@WebService(endpointInterface = "com.cantero.quickbooks.ws.QBWebConnectorSvcSoap")
public class ItemQueryRqSoapImpl implements QBWebConnectorSvcSoap {


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
        return 100;
    }

    @Override
    public String sendRequestXML(String ticket, String strHCPResponse,
                                 String strCompanyFileName, String qbXMLCountry, int qbXMLMajorVers,
                                 int qbXMLMinorVers) {
        //Example qbXML to Query for an Item
        //http://www.consolibyte.com/wiki/doku.php/quickbooks_qbxml_itemquery
        String query = "<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"7.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\"><ItemQueryRq requestID=\"SXRlbVF1ZXJ5fDEyMA==\"><OwnerID>0</OwnerID></ItemQueryRq></QBXMLMsgsRq></QBXML>";
        return query;
    }

    // @Override
    // public String sendRequestXML(String ticket, String strHCPResponse,
    //                              String strCompanyFileName, String qbXMLCountry, int qbXMLMajorVers,
    //                              int qbXMLMinorVers) {

    //     StringBuilder queryBuilder = new StringBuilder();
    //     queryBuilder.append("<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"7.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\">");
    //     final String SO_FILE_PATH = "C:/DHAS/dhas_nodejs/CSV/WRITE/Orders/Indonesia/ordersIN.csv";
    //     final String SO_LINE_ITEMS_FILE_PATH = "C:/DHAS/dhas_nodejs/CSV/WRITE/Orders/Indonesia/OrderItemsIn.csv";

    //     Map<String, List<String[]>> soLineItemsMap = new HashMap<>();

    //     try (CSVReader readerSO = new CSVReader(new FileReader(SO_FILE_PATH));
    //          CSVReader readerSOItems = new CSVReader(new FileReader(SO_LINE_ITEMS_FILE_PATH))) {

    //         readerSO.skip(1);
    //         readerSOItems.skip(1);

    //         String[] nextLineItem;
    //         while ((nextLineItem = readerSOItems.readNext()) != null) {
    //             String sOItemId = nextLineItem[0];
    //             soLineItemsMap.putIfAbsent(sOItemId, new ArrayList<>());
    //             soLineItemsMap.get(sOItemId).add(nextLineItem);
    //         }

    //         String[] nextLine;
    //         while ((nextLine = readerSO.readNext()) != null) {
    //             String sOId = nextLine[0];
    //             String cusId = nextLine[1];
    //             String soNumber = nextLine[2];

    //             queryBuilder.append("<SalesOrderAddRq requestID=\"2\">");
    //             queryBuilder.append("<SalesOrderAdd>");
    //             queryBuilder.append("<CustomerRef><ListID>").append(cusId).append("</ListID></CustomerRef>");
    //             queryBuilder.append("<TemplateRef><FullName>SALES ORDER</FullName></TemplateRef>");
    //             queryBuilder.append("<RefNumber>").append(soNumber).append("</RefNumber>");

    //             if (soLineItemsMap.containsKey(sOId)) {
    //                 for (String[] lineItem : soLineItemsMap.get(sOId)) {
    //                     String itemName = lineItem[1];
    //                     String quantity = lineItem[3];
    //                     // String salesUM = lineItem[4];

    //                     queryBuilder.append("<SalesOrderLineAdd>");
    //                     queryBuilder.append("<ItemRef><FullName>").append(itemName).append("</FullName></ItemRef>");
    //                     queryBuilder.append("<Quantity>").append(quantity).append("</Quantity>");
    //                     // queryBuilder.append("<UnitOfMeasureSetRef><FullName>").append(salesUM).append("</FullName></UnitOfMeasureSetRef>");
    //                     queryBuilder.append("</SalesOrderLineAdd>");
    //                 }
    //             }

    //             queryBuilder.append("</SalesOrderAdd>");
    //             queryBuilder.append("</SalesOrderAddRq>");
    //         }
    //     } catch (IOException | CsvException e) {
    //         e.printStackTrace();
    //         return "Error generating XML request: " + e.getMessage();
    //     }

    //     queryBuilder.append("</QBXMLMsgsRq></QBXML>");
    //     // System.out.println(queryBuilder.toString());
    //     return queryBuilder.toString();
    // }

}
