﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System;

public class ClientUDP : MonoBehaviour
{

    private static ClientUDP _singleton;
    public static ClientUDP singleton
    {
        get { return _singleton; }
        private set { _singleton = value; }

    }
    public string ServerHOST = "127.0.0.1";
    public ushort ServerPORT = 320;
    //is possible to instantiate sock with address and port if needed
    UdpClient sock = new UdpClient();//create a client called scok    //instantiate it in line

    /// <summary>
    /// Most recent ball update packet
    /// that has been recieved
    /// </summary>
    uint ackBallupdate = 0; //called ack because client server acknowledges the packet

    public Transform ball;
    void Start()
    {
        if(singleton != null)
        {
            //already have a clientUDP...
            Destroy(gameObject);
        }
        else
        {
            singleton = this;
            DontDestroyOnLoad(gameObject);

            //NetworkObject obj = ObjectRegistry.SpawnFrom("PLYR");
            //NetworkObject obj = ObjectRegistry.SpawnFrom("PAWN");
            IPEndPoint ep = new IPEndPoint(IPAddress.Parse(ServerHOST), ServerPORT);
            sock = new UdpClient(ep.AddressFamily);
            sock.Connect(ep);
            //print(obj);

            //set up receive loop (async)
            ListenForPackets();
            //send a packet to the server(async);
            SendPacket(Buffer.From("JOIN"));
        }
        
        
          
    }

  
    /// <summary>
    /// This function listens for incoming UDP packets
    /// </summary>
    async void ListenForPackets()
    {

        while(true)
        {
            UdpReceiveResult res;
            try
            {


                //could use Var res //put cursor in var, ctrl+period, then use explicit datatype to have IDE change it for you
                 res = await sock.ReceiveAsync();//create the res object
                Buffer packet = Buffer.From(res.Buffer); //Buffer from is going to take the res object and give us a packet we can process. 

                ProcessPacket(packet);
            }
            catch
            {
                break;
            }

           
        }//as soon as we are done processing packet we just start listening for another packet //this is due to an inifinite loop
        
    }


    /// <summary>
    /// This function processes a packet and decides what to do next
    /// </summary>
    /// <param name="packet">the packet to process</param>
     void ProcessPacket(Buffer packet)
    {
        if (packet.Length < 4) return; //do nothing becuase there isn't enough info to use
        string id = packet.ReadString(0, 4); //we read a string from location 0 and the first four bytes
        switch(id)
        {
            case "REPL":
                ProcessPacketREPL(packet);
                
                break;
            case "PAWN":
                if (packet.Length < 5) return;

                byte networkID = packet.ReadUInt8(4);
                NetworkObject obj = NetworkObject.GetObjectByNetworkID(networkID);
                if (obj)
                {
                    //Pawn p = (obj as Pawn);
                    Pawn p = (Pawn)obj;
                    if (p != null) p.canPlayerControl = true;
                }
                break;
        }//end of switch(id)

    }//end of void ProcessPacket

    private  void ProcessPacketREPL(Buffer packet)
    {
        if (packet.Length < 5) return; //do nothing becuase there isn't enough info to use
        int replType = packet.ReadUInt8(4);
        if (replType != 1 && replType != 2 && replType != 3) return;//DO NOTHING not a valid packet we can process
        int offset = 5;
        while (offset <= packet.Length)
        {
           // if (packet.Length < offset + 5) return; //do nothing becuase there isn't enough info to use

            
            int networkID = 0;
           // print(packet);
            switch (replType)
            {
                case 1: //create
                    if (packet.Length < offset + 5) return;
                    networkID = packet.ReadUInt8(offset + 4);
                    //print("REPL packet CREATE received....");

                    string classID = packet.ReadString(offset, 4);

                    //Check network ID!
                    if(NetworkObject.GetObjectByNetworkID(networkID) != null) return;


                    NetworkObject obj = ObjectRegistry.SpawnFrom(classID);
                    if (obj == null) return;//ERROR: Class ID is not found
                    offset += 4;//trim out classID off beginning of packet data
                    
                    
                    
                    offset += obj.Deserialize(packet.Slice(offset));

                    NetworkObject.AddObject(obj);
                    break;
                case 2: //update
                    if (packet.Length < offset + 5) return;
                    networkID = packet.ReadUInt8(offset + 4);
                    //lookup the object using the network ID


                    NetworkObject obj2 = NetworkObject.GetObjectByNetworkID(networkID);

                    if (obj2 == null) return;
                    print(obj2);
                        offset += 4;//trim out classID off beginning of packet data
                        offset += obj2.Deserialize(packet.Slice(offset));
                    
                    
                        
                    
                    break;
                case 3: //delete
                    print("WHAT");
                    if (packet.Length < offset) return;
                    networkID = packet.ReadUInt8(offset);
                    NetworkObject obj3 = NetworkObject.GetObjectByNetworkID(networkID);
                    if (obj3 == null) return;

                    NetworkObject.RemoveObject(networkID);

                    Destroy(obj3.gameObject);
                    offset++;
                    break;
                default: //??
                    break;
            }//End of nested switch

            //break;//no looping yet
        }//ENd of whileTrue
    }

    async public void SendPacket(Buffer packet)//takes a packet and sends it //made public so we can access it from packetBuilder
    {
        if (sock == null) return;
        if (!sock.Client.Connected) return;
        
        //TODO: Extract server and port into seperate variables
        //Buffer packet = Buffer.From("HELLO WORLD!");//should probably store IP and port somewhere else in code
        await sock.SendAsync(packet.bytes, packet.bytes.Length);
    }
    
    void Update()
    {
        
    }

    /// <summary>
    /// when destroying clean up objects\\
    /// </summary>
    private void OnDestroy()
    {
        sock.Close();//after we call on destory our loop is still running
    }
}
