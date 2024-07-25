package com.vela_app

import android.os.Bundle
import android.content.res.Configuration


import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.reactnativepipandroid.PipAndroidModule
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "vela_app"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null);
  }

  override fun onPictureInPictureModeChanged(isInPictureInPictureMode: Boolean, newConfig: Configuration) {
    PipAndroidModule.pipModeChanged(isInPictureInPictureMode)
}

/* 
my module
*/


  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
