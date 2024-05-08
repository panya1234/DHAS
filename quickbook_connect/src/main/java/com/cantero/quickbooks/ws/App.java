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

        Endpoint.publish("http://0.0.0.0:8080/GetItemInventoryQueryRq", new GetItemInventoryQueryRq());
        System.out.println("Test GetItemInventoryQueryRq");

        Endpoint.publish("http://0.0.0.0:8080/GetCustomerQueryRq", new GetCustomerQueryRq());
        System.out.println("Test GetCustomerQueryRq");

        Endpoint.publish("http://0.0.0.0:8080/AddSOPhilippines", new AddSOPhilippines());
        System.out.println("Test AddSOPhilippines");

        Endpoint.publish("http://0.0.0.0:8080/AddSOIndonesia", new AddSOIndonesia());
        System.out.println("Test AddSOIndonesia");
    }
} // or the version compatible with your JDK
