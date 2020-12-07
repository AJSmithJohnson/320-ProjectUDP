using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GetClientInput : MonoBehaviour
{
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
    }
}
