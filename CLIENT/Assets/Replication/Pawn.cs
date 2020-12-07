﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pawn : NetworkObject
{
    new public static string classID = "PAWN";
    //new public  int networkID = 12;
    public bool canPlayerControl = false;
    Vector3 velocity = new Vector3();
    void FixedUpdate()
    {
        if (canPlayerControl)
        {

             int moveX = (int)Input.GetAxisRaw("Horizontal");

            velocity.x = Accelerate(velocity.x, moveX);
           
            transform.position += new Vector3(velocity.x, 0, 0) * Time.fixedDeltaTime;
            
        }
    }

    float Accelerate(float vel, float acc)
    {
        if (acc != 0)
        {
            vel += acc * Time.fixedDeltaTime;
        }
        else
        {
            //not pressing left or right
            //slow down object
            if (vel > 0)
            {
                acc = -1;
                vel += acc * Time.fixedDeltaTime;
                if (vel < 0) vel = 0;
            }

            if (vel < 0)
            {
                acc = 1;
                vel += acc * Time.fixedDeltaTime;
                if (vel > 0) vel = 0;
            }
        }
        return vel;
    }
    public override void Serialize()
    {
         
    }

    public override int Deserialize(Buffer packet)
    {
        return base.Deserialize(packet);
    }


}