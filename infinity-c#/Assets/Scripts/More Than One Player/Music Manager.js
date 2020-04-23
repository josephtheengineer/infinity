// Title          : Dont Destroy.cs
// Usage          : Keeps an object from destroying on scene load.
// Original Author: Jashan
// Author         : Joseph Iuzzolino
// Date Created   : 26/02/2010
// Date Updated   : 13/01/2017
// Status         : GOOD-
//Msg Of The Day  : CacheServer FTW! :D

#pragma strict

 var NewMusic: AudioClip; //Pick an audio track to play.
 
 function Awake () {
      var go = GameObject.Find("Game Music"); //Finds the game object called Game Music.
      if (go.GetComponent.<AudioSource>().clip != NewMusic) { 
          go.GetComponent.<AudioSource>().clip = NewMusic; //Replaces the old audio with the new one set in the inspector.
          go.GetComponent.<AudioSource>().Play(); //Plays the audio.
      }
 }