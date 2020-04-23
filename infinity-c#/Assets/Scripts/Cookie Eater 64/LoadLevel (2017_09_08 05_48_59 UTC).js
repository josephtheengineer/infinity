// Title          : LoadLevel.js
// Usage          : Loads a scene when gameobject is pressed.
// Original Author: Joseph Iuzzolino
// Author         : Joseph Iuzzolino
// Date Created   : 18/01/2015
// Date Updated   : 29/11/2016
// Status         : GOOD-
//Msg Of The Day  : I haven't done this in a while

import UnityEngine.SceneManagement;

var isQuit = false;
var levelToLoad = 1;
var wait = 2;
var openFile = false;
var file = ("/Folder/File.Type");

function LoadLevel() {

	if (isQuit==true){

		Application.Quit();
	}
		if (openFile == false) {
		//await sleep(2);
		SceneManager.LoadScene(levelToLoad);
	}

	if (openFile == true) {

      Application.OpenURL (file);
   }
   //(Application.dataPath) +
}

function Update(){

	//quit game if escape key is pressed
 	if (Input.GetKey(KeyCode.Escape)){

		Application.Quit();
 	}
}