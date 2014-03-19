GTA-SA-CheatUI
==============

My buddy and I went pretty hard into GTA:SA iOS when it hit. He was using a hacked save-file in order to obtain unlimited money in the game, while I was not.

Of course, I eventually became jealous and utilized existing documentation of GTA:SA save files to manipulate my game file on-demand.

The software is available online at: http://chewmieser.github.io/GTA-SA-CheatUI/

History
-------

**Node.JS**

The software was originally created on Node.JS. When my friend saw it, he wondered how he'd be able to utilize the command-line software. Which gave me the original idea to begin creating a web-app-like interface for it.

**HTML5**

After creating the web-app, I had the realization that I could make this software front-end only, requiring no backend for manipulation. Thanks to Browserify, I was able to port the software to the client-side with buffer support. And with HTML5's FileSaving features, I can present the file for automatic download after the user has manipulated their save file.
