// Title          : MouseOver.cs
// Usage          : Calls a event when the mouse is over the attached object.
// Original Author: Joseph Iuzzolino
// Author         : Joseph Iuzzolino
// Date Created   : 09/01/2017
// Date Updated   : 09/01/2017
// Status         : GOOD-
//Msg Of The Day  : Ubuntu!

using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement;

public class MouseOver : MonoBehaviour {

	public bool displayInfo;
	public bool done;
	public int levelToLoad;
	public string animationName;
	public GameObject Text;
		
	void Start () {

		done = false;
		displayInfo = false;
		Text.gameObject.SetActive(false);
	}

	void Update () {

		if (done == false) {
			if (displayInfo == true) {
				GetComponent<Animation>().Play (animationName);
				Text.gameObject.SetActive(true);
				Done ();
			} else {
			
				//OnMouseExit ();
			}
		}
	}

	void OnMouseOver() {
		
		if (done == false)
			displayInfo = true;
	}

	void OnMouseExit() {

		Text.gameObject.SetActive(false);
		GetComponent<Animation>().Play (animationName + "2"); 
		displayInfo = false;
		done = false;
	}

	public void Done() {

		//displayInfo = false;
		done = true;
	}

	void OnMouseDown(){

		SceneManager.LoadScene(levelToLoad);
	}
}
