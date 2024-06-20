/******************************************************************************
 * @Author                : <>                                                *
 * @CreatedDate           : 2023-11-27 22:11:53                               *
 * @LastEditors           : <>                                                *
 * @LastEditDate          : 2023-11-28 01:39:03                               *
 * @FilePath              : WebServiceTest/src/com/cantero/quickbooks/ws/Main.java*
 * @CopyRight             : MerBleueAviation                                  *
 *****************************************************************************/

package com.cantero.quickbooks.ws;

import javax.xml.ws.Endpoint;

public class App {
    public static void main(String[] args) {
        // Endpoint.publish("http://localhost:54321/ItemQueryRqSoapImpl", new ItemQueryRqSoapImpl());
        // System.out.print("Test ItemQueryRqSoapImpl");

        // Endpoint.publish("http://localhost:54321/CustomerAddRqSoapImpl", new CustomerAddRqSoapImpl());
        // System.out.print("Test CustomerAddRqSoapImpl");

        System.out.println("--Indonesia--");
        Endpoint.publish("http://dev-apiqbook.dhas.com/AddSOIndonesia", new AddSOIndonesia());
        System.out.println("AddSOIndonesia ");

        Endpoint.publish("http://dev-apiqbook.dhas.com/GetINItemInventory", new GetINItemInventory());
        System.out.println("GetINItemInventory ");

        Endpoint.publish("http://dev-apiqbook.dhas.com/GetINCustomer", new GetINCustomer());
        System.out.println("GetINCustomer ");

        System.out.println("--Philippines--");
        Endpoint.publish("http://dev-apiqbook.dhas.com/AddSOPhilippines", new AddSOPhilippines());
        System.out.println("AddSOPhilippines ");

        Endpoint.publish("http://dev-apiqbook.dhas.com/GetPHPItemInventory", new GetPHPItemInventory());
        System.out.println("GetPHPItemInventory ");

        Endpoint.publish("http://dev-apiqbook.dhas.com/GetPHPCustomer", new GetPHPCustomer());
        System.out.println("GetPHPCustomer ");
    }
} // or the version compatible with your JDK
