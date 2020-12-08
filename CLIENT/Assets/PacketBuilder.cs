using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class PacketBuilder 
{
    //GET TWO PEOPLE TO CONNECT and CONTROL BALLS
    //READ CHAPTER 5 about object replication
    //DO QUIZZZZZ ON CANVAS
    //NEXTWEEK HAVE AN IDEA ABOUT WHAT TYPE OF GAME YOU WANT TO MAKE
    static int previousInputH = 0;

    //cannot instatiate a packet builder //this is following the factory design pattern
   
    public static Buffer CurrentInput()
    {
       
        int h =(int) Input.GetAxisRaw("Horizontal"); //gives us a\ -1 or 1
        //Debug.Log("Horizontal input is " + h);
        if (h == previousInputH) return null;
        previousInputH = h;
        Buffer b = Buffer.Alloc(5);
        b.WriteString("INPT");
        b.WriteInt8((sbyte)h, 4);
        //b.WriteInt8((sbyte)m, 5);should do firing as a seperate input
        //I'm not sure it's good to send all the clients inputs as seperate packets but that can get debugged later
        return b;
    }

    public static Buffer ShootProjectile()
    {
        int m = IsMouseButtonDown();
        Buffer b = Buffer.Alloc(5);
        b.WriteString("SHOT");
        b.WriteInt8((sbyte)m, 4);
        return b;
    }


    public static int IsMouseButtonDown()
    {
        if (Input.GetMouseButton(0))
        {
            return 1;
        }
        return 0;
    }
}
