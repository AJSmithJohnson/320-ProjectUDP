using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GetClientInput : MonoBehaviour
{
   
    public bool readied = false;



    
    void Start()
    {
        readied = false;

    }

    // Update is called once per frame
    void Update()
    {
        
        Buffer b = PacketBuilder.CurrentInput();
        if (b != null)
        {
            ClientUDP.singleton.SendPacket(b);//alot of issues with the way we are doing this // doing this 60 times a second is not a great way to do this
        }

        
        

        
    }
    
   

    
}
