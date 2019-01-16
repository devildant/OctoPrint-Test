# coding=utf-8
from __future__ import absolute_import

from shutil import copyfile
import octoprint.plugin
import os
import subprocess
import time
import datetime
import glob
from flask import make_response
from octoprint.server import user_permission
from octoprint.events import eventManager, Events
import threading
import logging


class TestPlugin(octoprint.plugin.SettingsPlugin,
							  octoprint.plugin.AssetPlugin,
                              octoprint.plugin.TemplatePlugin,
							  octoprint.plugin.SimpleApiPlugin,
							  octoprint.plugin.EventHandlerPlugin,
							  octoprint.plugin.StartupPlugin):
	
	
	def sdcard(self, printer, filename, absolutePath, sd_upload_started, success_hook_sdcopy, error_hook_sdcopy, *args, **kwargs):
		remoteName = "test.gco"
		
		#sd_upload_started(filename, remoteName)
		def process():
			time.sleep(10)
			success_hook_sdcopy(filename, remoteName, 10)
			
		thread = threading.Thread(target=process)
		thread.daemon = True
		thread.start()
		return remoteName
		
def __plugin_load__():
	plugin = TestPlugin()

	global __plugin_implementation__
	__plugin_implementation__ = plugin

	global __plugin_hooks__
	__plugin_hooks__ = {
	"octoprint.printer.sdcardupload": plugin.sdcard
	}
	
	global __plugin_name__
	__plugin_name__ = "test"



