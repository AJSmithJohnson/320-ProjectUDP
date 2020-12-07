using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Reflection;

//\public delegate NetworkObject SpawnDelegate();//completely forget what this was used for

//Changed from static to public put in monobehavior
 public class ObjectRegistry : MonoBehaviour
{
    [Serializable]
    public class RegisteredPrefab //this is public for accessibility reasons
    {
        public string classID = "";//the object registry's unique signature
        public NetworkObject prefab; // the prefab but stored as a reference to something with the network objects

    }

    //Reflection is code that lets you pull apart the code base itself
    //reflection classes are all about letting you pull apart all the functions and classes and stuff inside of it
    //static private Dictionary<string, Type> registeredTypes = new Dictionary<string, Type>();//not using this anymore

    static private ObjectRegistry _singleton;

    static private Dictionary<string, NetworkObject> registeredPrefabs = new Dictionary<string, NetworkObject>();

    public RegisteredPrefab[] prefabs;//this creates an array of objects

    private void Start()
    {
        if(_singleton == null)
        {
            _singleton = this;
            DontDestroyOnLoad(this.gameObject);
            RegisterAll();
        }
        else
        {
            Destroy(this.gameObject);

        }
    }


    public void RegisterAll()
    {
        //RegisterClass(Pawn.classID, ()=> {return new Pawn(); });
        //RegisterClass<Pawn>();
        foreach(RegisteredPrefab rp in prefabs)
        {
            if (!registeredPrefabs.ContainsKey(rp.classID))
            {
                registeredPrefabs.Add(rp.classID, rp.prefab);
            }
            
        }//end of foreach


    }//end of public Void

   
    //Not in use anymore
    static public void RegisterClass<T> () where T : NetworkObject
    {
        //lookup reflection and generics
        
        //string classID = (string) typeof(T).GetField("classID").GetValue(null);


        //registeredTypes.Add(classID, typeof(T));
    }

    static public NetworkObject SpawnFrom(string classID)
    {
        if(    registeredPrefabs.ContainsKey(classID))
        {

            //ConstructorInfo cinfo = registeredTypes[classID].GetConstructor(new System.Type[] { });
            //return (NetworkObject)cinfo.Invoke(null);
            return Instantiate(registeredPrefabs[classID]);
        }

        return null;
    }
}
