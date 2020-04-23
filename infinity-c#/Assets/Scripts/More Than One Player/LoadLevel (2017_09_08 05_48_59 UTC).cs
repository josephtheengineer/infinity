using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LoadLevel : MonoBehaviour {

	public float timeLeft = 30.0f;
	public int levelToLoad;

	void Update()
	{
		timeLeft -= Time.deltaTime;
		if(timeLeft < 0)
		{
			SceneManager.LoadScene(levelToLoad);
		}
	}
}
