using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class Version : MonoBehaviour {

	//public TextMesh txt;
	private string version = "More Than One Player 1.2.5.11";

	// Use this for initialization
	void Start () {
		GetComponent<TextMesh>().text = version;
		//txt = gameObject.GetComponent<Text>(); 
		//txt.text = version;
	}

	// Update is called once per frame
	void Update () {
		GetComponent<TextMesh>().text = version;
		//txt.text = version;  
		//currentscore = PlayerPrefs.GetInt("TOTALSCORE"); 
		//PlayerPrefs.SetInt("SHOWSTARTSCORE",currentscore); 
	}
}
