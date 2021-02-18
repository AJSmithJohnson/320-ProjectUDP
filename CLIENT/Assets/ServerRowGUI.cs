using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class ServerRowGUI : MonoBehaviour
{
    public Text txtServerName;
    public Button bttn;
    private RemoteServer server;

    public void Init(RemoteServer server)
    {
        this.server = server;
        txtServerName.text = server.serverName;
    }

    public void ClickedTheButton()
    {
        print("CLicked the button");
        ClientUDP.singleton.ConnectToServer(server.endPoint.Address.ToString(), (ushort)server.endPoint.Port);
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
