using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class PacketBuilder 
{
    
    static int previousInputH = 0;

    static int previousInputS = 0;
    
   
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
        
        return b;
    }

    public static Buffer ReadyUpButton()
    {
        Buffer c = Buffer.Alloc(4);
        c.WriteString("REDY");
        return c;
    }
    public static Buffer ReadyNotButton()
    {
        Buffer d = Buffer.Alloc(4);
        d.WriteString("NRDY");
        return d;
    }
   


   
}
