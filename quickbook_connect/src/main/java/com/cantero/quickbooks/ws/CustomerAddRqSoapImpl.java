/******************************************************************************
 * @Author                : <>                                                *
 * @CreatedDate           : 2023-11-28 01:06:01                               *
 * @LastEditors           : <>                                                *
 * @LastEditDate          : 2023-11-28 01:06:01                               *
 * @FilePath              : WebServiceTest/src/com/cantero/quickbooks/ws/CompanyAddRqSoapImpl.java*
 * @CopyRight             : MerBleueAviation                                  *
 *****************************************************************************/

package com.cantero.quickbooks.ws;

import java.util.ArrayList;

import javax.jws.WebService;

/*
 * http://developer.intuit.com/qbsdk-current/doc/pdf/qbwc_proguide.pdf
 */
@WebService(endpointInterface = "com.cantero.quickbooks.ws.QBWebConnectorSvcSoap")
public class CustomerAddRqSoapImpl implements QBWebConnectorSvcSoap {


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
        String query = "<?xml version=\"1.0\" encoding=\"utf-8\"?><?qbxml version=\"7.0\"?><QBXML><QBXMLMsgsRq onError=\"stopOnError\"><CustomerAddRq requestID=\"2\"><CustomerAdd><Name>Joe Customer</Name><IsActive>1</IsActive><CompanyName>Joes Garage</CompanyName><Salutation>Mr</Salutation><FirstName>Joe</FirstName><LastName>Customer</LastName><BillAddress><Addr1>123 Main St.</Addr1><City>Mountain View</City><State>CA</State><PostalCode>94566</PostalCode></BillAddress><Phone>650-944-1111</Phone><AltPhone>650-944-2111</AltPhone><Email>joe@joegargage.com</Email><TermsRef><FullName>Net 30</FullName></TermsRef><AccountNumber>89087</AccountNumber><CreditLimit>2000.00</CreditLimit></CustomerAdd></CustomerAddRq><CustomerAddRq requestID=\"3\"><CustomerAdd><Name>Equipment Installation</Name><IsActive>1</IsActive><ParentRef><FullName>Joe Customer</FullName></ParentRef><JobStatus>Awarded</JobStatus><JobStartDate>2001-03-01</JobStartDate><JobProjectedEndDate>2001-12-01</JobProjectedEndDate> <JobEndDate>2001-12-15</JobEndDate><JobDesc>Install new smog equipment</JobDesc></CustomerAdd></CustomerAddRq></QBXMLMsgsRq></QBXML>";
        return query;
    }

}
