using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Obstacle : NetworkObject
{

    new public static string classID = "OBCL";
    public bool canPlayerControl = false;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    public override void Serialize()
    {

    }
    public override int Deserialize(Buffer packet)
    {
        return base.Deserialize(packet);
    }
}
