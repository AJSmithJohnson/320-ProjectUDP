using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GetClientInput : MonoBehaviour
{

    //SHOULD FACTOR IN INPUT HERE SO THAT IF THE PLAYER IS PRESSING SOMETHING THEN WE SEND THE PACKET
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
        Buffer b = PacketBuilder.CurrentInput();
        if (b != null)
        {
            ClientUDP.singleton.SendPacket(b);//alot of issues with the way we are doing this // doing this 60 times a second is not a great way to do this
        }

        //If client presses mouse button we try to shoot projectile
        
        Buffer s = PacketBuilder.ShootProjectile();
        if (s != null)
        {
            ClientUDP.singleton.SendPacket(s);
         }
        

        
    }
}
