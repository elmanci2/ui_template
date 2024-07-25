
 package com.vela_app.modules.notification
 import android.app.Activity

 import android.Manifest
 import android.app.NotificationChannel
 import android.app.NotificationManager
 import android.app.PendingIntent
 import android.content.*
 import android.content.pm.PackageManager
 import android.net.Uri
 import android.os.Build
 import android.os.Environment
 import android.provider.MediaStore
 import android.widget.RemoteViews
 import androidx.core.app.ActivityCompat
 import androidx.core.app.NotificationCompat
 import androidx.core.app.NotificationManagerCompat
 import androidx.core.content.ContextCompat
 import com.facebook.react.bridge.*
 import java.io.*
 import java.net.HttpURLConnection
 import java.net.URL
 import java.util.concurrent.Executors
 import java.util.concurrent.atomic.AtomicInteger
 import com.vela_app.R
 
 class DownloadModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
 
     companion object {
         private const val CHANNEL_ID = "DownloadChannel"
         private const val PAUSE_ACTION = "com.vela_app.modules.notification.PAUSE"
         private const val RESUME_ACTION = "com.vela_app.modules.notification.RESUME"
         private const val STOP_ACTION = "com.vela_app.modules.notification.STOP"
         private const val CLICK_ACTION = "com.vela_app.modules.notification.CLICK"
         private const val THREAD_COUNT = 20
         private var isPaused = false
         private var isStopped = false
         private const val REQUEST_CODE_PERMISSIONS = 1001
     }
 
     init {
         createNotificationChannel()
         registerReceiver()
     }
 
     override fun getName() = "DownloadModule"
 
     @ReactMethod
     private fun downloadVideo(url: String, title: String, fileName: String, folderName: String, callback: Callback) {
         if (!hasPermissions()) {
             requestPermissions()
             callback.invoke("Permissions not granted")
             return
         }
 
         isPaused = false
         isStopped = false
 
         Thread {
             try {
                 val downloadUrl = URL(url)
                 val connection = downloadUrl.openConnection() as HttpURLConnection
                 connection.connect()
 
                 if (connection.responseCode != HttpURLConnection.HTTP_OK) {
                     callback.invoke("Server returned HTTP ${connection.responseCode} ${connection.responseMessage}")
                     return@Thread
                 }
 
                 val fileSize = connection.contentLength
                 if (fileSize <= 0) {
                     callback.invoke("File size is invalid")
                     return@Thread
                 }
 
                 val partSize = fileSize / THREAD_COUNT
                 val tempFiles = mutableListOf<File>()
                 val executor = Executors.newFixedThreadPool(THREAD_COUNT)
                 val downloadedBytes = AtomicInteger(0)
 
                 showNotification(title, fileName, 0)
 
                 for (i in 0 until THREAD_COUNT) {
                     val start = i * partSize
                     val end = if (i == THREAD_COUNT - 1) fileSize - 1 else start + partSize - 1
                     val tempFile = File.createTempFile("part$i", null, reactApplicationContext.cacheDir)
                     tempFiles.add(tempFile)
 
                     executor.execute {
                         downloadPart(downloadUrl, tempFile, start, end, downloadedBytes, fileSize, title)
                     }
                 }
 
                 executor.shutdown()
                 while (!executor.isTerminated) {
                     if (isStopped) {
                         tempFiles.forEach { it.delete() }
                         cancelNotification()
                         callback.invoke("Download stopped by user")
                         return@Thread
                     }
                     Thread.sleep(100)
                 }
 
                 val velaDir =  File(reactApplicationContext.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "vela")
                 if (!velaDir.exists()) {
                     velaDir.mkdirs()
                 }
 
                 val folderDir = File(velaDir, folderName)
                 if (!folderDir.exists()) {
                     folderDir.mkdirs()
                 }
 
                 val outputFile = File(folderDir, fileName)
                 mergeFiles(tempFiles, outputFile)
                 tempFiles.forEach { it.delete() }
 
                 showCompletedNotification(title, "Descargado")
                 callback.invoke(null, outputFile.absolutePath)
             } catch (e: Exception) {
                 callback.invoke(e.message)
             }
         }.start()
     }
 
     private fun downloadPart(url: URL, tempFile: File, start: Int, end: Int, downloadedBytes: AtomicInteger, fileSize: Int, title: String) {
         try {
             val connection = url.openConnection() as HttpURLConnection
             connection.setRequestProperty("Range", "bytes=$start-$end")
             connection.connect()
 
             val inputStream = connection.inputStream
             val outputStream = FileOutputStream(tempFile)
 
             val buffer = ByteArray(4096)
             var bytesRead: Int
 
             while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                 if (isPaused) {
                     Thread.sleep(100)
                     continue
                 }
                 if (isStopped) break
 
                 outputStream.write(buffer, 0, bytesRead)
                 downloadedBytes.addAndGet(bytesRead)
                 val progress = (downloadedBytes.get() * 100L / fileSize).toInt()
                 updateNotification(title, progress, downloadedBytes.get().toLong(), fileSize)
             }
 
             outputStream.close()
             inputStream.close()
         } catch (e: Exception) {
             e.printStackTrace()
         }
     }
 
     private fun mergeFiles(files: List<File>, outputFile: File) {
         FileOutputStream(outputFile).use { fos ->
             files.forEach { file ->
                 FileInputStream(file).use { fis ->
                     fis.copyTo(fos)
                 }
             }
         }
     }
 
     private fun createNotificationChannel() {
         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
             val name = "Download Channel"
             val descriptionText = "Channel for download notifications"
             val importance = NotificationManager.IMPORTANCE_LOW
             val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                 description = descriptionText
             }
             val notificationManager: NotificationManager =
                 reactApplicationContext.getSystemService(NotificationManager::class.java) as NotificationManager
             notificationManager.createNotificationChannel(channel)
         }
     }
 
     private fun getCustomNotificationView(title: String, text: String, progress: Int): RemoteViews {
         val customView = RemoteViews(reactApplicationContext.packageName, R.layout.notification_layout)
         customView.setTextViewText(R.id.notification_title, title)
         customView.setTextViewText(R.id.notification_text, text)
         customView.setProgressBar(R.id.notification_progress, 100, progress, false)
 
         val pauseIntent = Intent(PAUSE_ACTION)
         val pausePendingIntent = PendingIntent.getBroadcast(reactApplicationContext, 0, pauseIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
         customView.setOnClickPendingIntent(R.id.notification_pause, pausePendingIntent)
 
         val resumeIntent = Intent(RESUME_ACTION)
         val resumePendingIntent = PendingIntent.getBroadcast(reactApplicationContext, 0, resumeIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
         customView.setOnClickPendingIntent(R.id.notification_resume, resumePendingIntent)
 
         val stopIntent = Intent(STOP_ACTION)
         val stopPendingIntent = PendingIntent.getBroadcast(reactApplicationContext, 0, stopIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
         customView.setOnClickPendingIntent(R.id.notification_stop, stopPendingIntent)
 
         return customView
     }
 
     private fun showNotification(title: String, text: String, progress: Int) {
         val notificationManager = NotificationManagerCompat.from(reactApplicationContext)
 
         val notificationBuilder = NotificationCompat.Builder(reactApplicationContext, CHANNEL_ID)
             .setSmallIcon(android.R.drawable.stat_sys_download)
             .setPriority(NotificationCompat.PRIORITY_LOW)
             .setOnlyAlertOnce(true)
             .setOngoing(true)
             .setStyle(NotificationCompat.DecoratedCustomViewStyle())
             .setCustomContentView(getCustomNotificationView(title, text, progress))
             .setVisibility(NotificationCompat.VISIBILITY_SECRET)
             .setContentIntent(getClickPendingIntent())
 
         notificationManager.notify(1, notificationBuilder.build())
     }
 
     private fun showCompletedNotification(title: String, text: String) {
         val notificationManager = NotificationManagerCompat.from(reactApplicationContext)
 
         val notificationBuilder = NotificationCompat.Builder(reactApplicationContext, CHANNEL_ID)
             .setSmallIcon(android.R.drawable.stat_sys_download_done)
             .setPriority(NotificationCompat.PRIORITY_LOW)
             .setOnlyAlertOnce(true)
             .setOngoing(false)
             .setStyle(NotificationCompat.DecoratedCustomViewStyle())
             .setCustomContentView(getCustomNotificationView(title, text, 100))
             .setVisibility(NotificationCompat.VISIBILITY_SECRET)
             .setContentIntent(getClickPendingIntent())
 
         notificationManager.notify(1, notificationBuilder.build())
     }
 
     private fun updateNotification(title: String, progress: Int, totalBytesRead: Long, fileSize: Int) {
         val notificationManager = NotificationManagerCompat.from(reactApplicationContext)
         val progressText = "$progress% (${totalBytesRead / (1024 * 1024)} MB / ${fileSize / (1024 * 1024)} MB)"
         val notificationBuilder = NotificationCompat.Builder(reactApplicationContext, CHANNEL_ID)
             .setSmallIcon(android.R.drawable.stat_sys_download)
             .setPriority(NotificationCompat.PRIORITY_LOW)
             .setOnlyAlertOnce(true)
             .setOngoing(true)
             .setStyle(NotificationCompat.DecoratedCustomViewStyle())
             .setCustomContentView(getCustomNotificationView(title, progressText, progress))
             .setVisibility(NotificationCompat.VISIBILITY_SECRET)
             .setContentIntent(getClickPendingIntent())
 
         notificationManager.notify(1, notificationBuilder.build())
     }
 
     private fun cancelNotification() {
         val notificationManager = NotificationManagerCompat.from(reactApplicationContext)
         notificationManager.cancel(1)
     }
 
     private fun getClickPendingIntent(): PendingIntent {
         val clickIntent = Intent(CLICK_ACTION)
         return PendingIntent.getBroadcast(reactApplicationContext, 0, clickIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
     }
 
     private fun registerReceiver() {
         val filter = IntentFilter().apply {
             addAction(PAUSE_ACTION)
             addAction(RESUME_ACTION)
             addAction(STOP_ACTION)
             addAction(CLICK_ACTION)
         }
         reactApplicationContext.registerReceiver(object : BroadcastReceiver() {
             override fun onReceive(context: Context?, intent: Intent?) {
                 when (intent?.action) {
                     PAUSE_ACTION -> isPaused = true
                     RESUME_ACTION -> isPaused = false
                     STOP_ACTION -> isStopped = true
                     CLICK_ACTION -> {} // Handle notification click if needed
                 }
             }
         }, filter)
     }

     
 

     private fun hasPermissions(): Boolean {
         return ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED &&
                 ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
     }
 
     private fun requestPermissions() {
         ActivityCompat.requestPermissions(
             currentActivity as Activity,
             arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE),
             REQUEST_CODE_PERMISSIONS
         )
     }
 }
 