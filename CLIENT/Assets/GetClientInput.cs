using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GetClientInput : MonoBehaviour
{
    public Button readyUpButton;
    public Text playerNamePrefab;
    public Text scorePrefab;
    public bool readied = false;


    private Text playerName;
    private Text score;

    //SHOULD FACTOR IN INPUT HERE SO THAT IF THE PLAYER IS PRESSING SOMETHING THEN WE SEND THE PACKET
    // Start is called before the first frame update
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

        //If client presses mouse button we try to shoot projectile
        
       /* Buffer s = PacketBuilder.ShootProjectile();
        if (s != null)
        {
            ClientUDP.singleton.SendPacket(s);
         }*/
        

        
    }
    //After game starts then we need to set the buttons.interactable to false
    //readyUpButton.interactable = false;
   

    
}
