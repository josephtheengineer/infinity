using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Windows.Speech;
using System.Collections.Generic;
using System.Linq;
using UnityEngine.UI;

public class SpeechRecognition : MonoBehaviour {

	KeywordRecognizer keywordRecognizer;
	Dictionary<string,System.Action> keywords = new Dictionary<string, System.Action>();

	public Text CommandLine;
	private float startTime;
	private float time;

	// Use this for initialization
	void Start () {
		//WindowsVoice.theVoice.speak("Infinity Called");
		keywords.Add ("Infinity", () => {

			InfinityCalled();
		});

		keywords.Add ("Say", () => {

			InfinityCalled();
		});
		keywordRecognizer = new KeywordRecognizer (keywords.Keys.ToArray ());
		keywordRecognizer.OnPhraseRecognized += KeywordRecognizerOnPhraseRecognized;
		keywordRecognizer.Start ();
		InfinityCalled();
		startTime = Time.time;
	}
	 
	void KeywordRecognizerOnPhraseRecognized(PhraseRecognizedEventArgs args) {

		System.Action keywordAction;

		if (keywords.TryGetValue (args.text, out keywordAction)) {

			keywordAction.Invoke ();
		}
	}

	void InfinityCalled() {
		
		string generate = ("C:\\Users\\Joseph\\Google Drive\\Infinity Devolopment\\Day 1 - Infinity indev_prototype 0.1.0.1\\Infinity.py");
//		string play = ("C:\\Users\\Joseph\\Google Drive\\Infinity Devolopment\\Day 1 - Infinity indev_prototype 0.1.0.1\\Init.mp3");
		string name = ("Infinity");
		string command = ("Triggered");

		print(name + time);
//		GetComponent<TextMesh>().text = name;
		WindowsVoice.theVoice.speak(command);
		Application.OpenURL (generate);
		StartCoroutine (Play ());
//		if (System.IO.File.Exists(play))
//		{
//			Application.OpenURL (play);
//		}
	}

	IEnumerator Play() {

		yield return new WaitForSeconds(5.0f);
		string play = ("C:\\Users\\Joseph\\Google Drive\\Infinity Devolopment\\Day 1 - Infinity indev_prototype 0.1.0.1\\Init.mp3");

		Application.OpenURL (play);
	}

	void SayCalled() {

		print("Say Called");
	}

	void Update() {

		float time = Time.time - startTime;
	}
}
