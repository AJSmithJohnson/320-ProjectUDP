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

    static int previousInputS = 0;
    //cannot instatiate a packet builder //this is following the factory design pattern
   
    public static Buffer CurrentInput()
    {
        int s = 0;
        int h =(int) Input.GetAxisRaw("Horizontal"); //gives us a\ -1 or 1
        if (Input.GetMouseButtonDown(0))
        {
            s = 1;
        }
        else
        {
            s = 0;
        }
        Debug.Log("Horizontal input is " + h);
        //if (h == previousInputH && s == previousInputS) return null;
        //previousInputH = h;
        
        Buffer b = Buffer.Alloc(6);
        b.WriteString("INPT");
        b.WriteInt8((sbyte)h, 4);
        b.WriteInt8((sbyte)s, 5);
        //I'm not sure it's good to send all the clients inputs as seperate packets but that can get debugged later
        return b;
    }


   /* //TODO: Refactor we are checking for mousebutton down in GetClientInput
    //so just send 1
    public static Buffer ShootProjectile()
    {
                
            int m = IsMouseButtonDown();
            Buffer b = Buffer.Alloc(5);
            b.WriteString("SHOT");
            b.WriteInt8((sbyte)m, 4);
            return b;
        
    }*/


   
}
