package com.cantero.quickbooks.ws;

import java.util.ArrayList;

import javax.jws.WebService;

import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;
import com.opencsv.CSVWriter;

/*
 * http://developer.intuit.com/qbsdk-current/doc/pdf/qbwc_proguide.pdf
 */
@SuppressWarnings("unused")
@WebService(endpointInterface = "com.cantero.quickbooks.ws.QBWebConnectorSvcSoap")
public class GetItemInventoryQueryRq implements QBWebConnectorSvcSoap {


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
    public int receiveResponseXML(String ticket, String response, String hresult, String message) {
        // System.out.println(response);
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            InputSource is = new InputSource(new StringReader(response));
            Document document = builder.parse(is);

            NodeList itemList = document.getElementsByTagName("ItemInventoryRet");
            try (CSVWriter writer = new CSVWriter(new FileWriter("CSV/READ/products.csv"))) {
                writer.writeNext(new String[]{"externalId", "productCost", "productStock"});
                for (int i = 0; i < itemList.getLength(); i++) {
                    Element item = (Element) itemList.item(i);
                    String Name = item.getElementsByTagName("Name").item(0).getTextContent();
                    
                    NodeList dataExtList = item.getElementsByTagName("DataExtRet");
                    String currency = "";
                    for (int j = 0; j < dataExtList.getLength(); j++) {
                        Element dataExt = (Element) dataExtList.item(j);
                        String dataExtName = dataExt.getElementsByTagName("DataExtName").item(0).getTextContent();
                        if (dataExtName.equals("Currency")) {
                            currency = dataExt.getElementsByTagName("DataExtValue").item(0).getTextContent();
                        }
                    }
                    String externalId = Name+currency;

                    String averageCost = item.getElementsByTagName("AverageCost").item(0).getTextContent();
                    String quantityOnHand = item.getElementsByTagName("QuantityOnHand").item(0).getTextContent();
                    String quantityOnSalesOrder = item.getElementsByTagName("QuantityOnSalesOrder").item(0).getTextContent();
                    int stock = Integer.parseInt(quantityOnHand) - Integer.parseInt(quantityOnSalesOrder);
                    String stockAsString = String.valueOf(stock);
                    writer.writeNext(new String[]{externalId, averageCost, stockAsString});
                }
                System.out.println("products.csv file created successfully.");
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (ParserConfigurationException | SAXException | IOException e) {
            e.printStackTrace();
        }
        return 100;
    }

    @Override
    public String sendRequestXML(String ticket, String strHCPResponse,
                                 String strCompanyFileName, String qbXMLCountry, int qbXMLMajorVers,
                                 int qbXMLMinorVers) {
        //Example qbXML to Query for an Item
        //http://www.consolibyte.com/wiki/doku.php/quickbooks_qbxml_itemquery
        String query = "<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"7.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\"><ItemInventoryQueryRq requestID=\"2\"><OwnerID>0</OwnerID></ItemInventoryQueryRq></QBXMLMsgsRq></QBXML>";
        return query;
    }

}
