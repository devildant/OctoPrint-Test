$(function() {
    function SdSwitchFastCopyViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];
        self.printer = parameters[2];
		self.timeoutTry = -1;

        self.onBeforeBinding = function() {
            self.checkStatus();
        }
		
		self.onStartupComplete = function () {
			console.log("check status");
			self.checkStatus();
			if (self.printer.isPrinting())
			{
				$("#resetsdswitchfstcopy").prop("disabled", true);
			} else {
				$("#resetsdswitchfstcopy").prop("disabled", false);
			}
			if (self.printer.isPrinting())
			{
				$("#formatsdswitchfstcopy").prop("disabled", true);
			} else {
				$("#formatsdswitchfstcopy").prop("disabled", false);
			}
			$("#sdswitchfactory_bcmused").on("change", function () {
					$(this).children("i").show();
					$("#sdswitchfactory_bcmused").prop("disabled", true);
					 $.ajax({
						url: API_BASEURL + "plugin/sdswitchfastcopy",
						type: "POST",
						data: JSON.stringify({
							command: "test",
							bcm: $("#sdswitchfactory_bcmused").is(':checked')
						}),
						context:self,
						contentType: "application/json; charset=UTF-8"
					}).done(function(data, textStatus, jqXHR ){
						this.checkStatusAction(data);
						$("#sdswitchfactory_bcmused").prop("disabled", false);
					})	
			});		
			$("#resetsdswitchfstcopy").on("click", function () {
					$(this).children("i").show();
					$("#resetsdswitchfstcopy").prop("disabled", true);
					setTimeout(function (current) {
					$.ajax({
						url: API_BASEURL + "plugin/sdswitchfastcopy",
						type: "POST",
						dataType: "json",
						data: JSON.stringify({
							command: "reset"
						}),
						contentType: "application/json; charset=UTF-8"
					}).done(function() {
						$("#resetsdswitchfstcopy").children("i").hide();
						$("#resetsdswitchfstcopy").prop("disabled", false);
					}); 
				});		
			});	
	
			$("#sdswitchfstcopyFormatSD").on("click", function () {
					$("#formatsdswitchfstcopy").children("i").show();
					$("#formatsdswitchfstcopy").prop("disabled", true);
					$("#formatsdswitchfstcopy").attr("lock", "ws");
					setTimeout(function (current) {
					$.ajax({
						url: API_BASEURL + "plugin/sdswitchfastcopy",
						type: "POST",
						dataType: "json",
						data: JSON.stringify({
							command: "format"
						}),
						contentType: "application/json; charset=UTF-8"
					}).done(function() {
						if ($("#formatsdswitchfstcopy").attr("lock") == "ws")
						{
							$("#formatsdswitchfstcopy").children("i").hide();
							$("#formatsdswitchfstcopy").prop("disabled", false);
							$("#formatsdswitchfstcopy").attr("lock", "none");
						}
						
					}); 
				});
			});	
			
			$("#formatsdswitchfstcopy").on("click", function () {
				$("#sdswitchfstcopyWarning").modal("show");
			});		
		};


		// $("#settings_dialog").on('hidden', function () {
			  // self.checkStatus();
		// })
		self.eventChangeCheckToRadio =  function (id, listOff) {
				$(id).on("change", function () {
				if ($(this).prop("checked") == true)
				{
					listOff.forEach(function(element) {
						if (id != element.id)
						{
							if ($(element.id).prop("checked") == true)
							{
								$(element.id).unbind("change");
								$(element.id).trigger("click");
								self.eventChangeCheckToRadio(element.id, listOff);
							}
						}
					});
				}
			})
		}
		
		self.listOffMode = [
			{"id" : "#sdswitchfactory_remove"}
		]
		
		self.eventChangeCheckToRadio("#sdswitchfactory_remove", self.listOffMode);
		
		self.onEventPrinterStateChanged = function(payload) {
			if (payload.state_id == "PRINTING" || payload.state_id == "PAUSED"){
				$("#resetsdswitchfstcopy").prop("disabled", true);
			} else {
				$("#resetsdswitchfstcopy").prop("disabled", false);
			}
		}
		
		self.onEventPrinterStateChanged = function(payload) {
			if (payload.state_id == "PRINTING" || payload.state_id == "PAUSED"){
				$("#formatsdswitchfstcopy").prop("disabled", true);
			} else {
				$("#formatsdswitchfstcopy").prop("disabled", false);
			}
		}
		
		self.checkStatusAction = function(data) {
			if (data == "error")
				{
					$("[isdswitchfstcopy=error]").show();
					$("[isdswitchfstcopychild=conf]").show();
					$("[isdswitchfstcopychild=GPIO]").hide();
					$("[isdswitchfstcopy=success]").hide();
					$("#sdswitchfstcopysideloader").hide();
				} else if (data == "ok") {
					$("[isdswitchfstcopy=success]").show();
					$("[isdswitchfstcopy=error]").hide();
					$("[isdswitchfstcopychild=conf]").hide();
					$("[isdswitchfstcopychild=GPIO]").hide();
					$("#sdswitchfstcopysideloader").hide();
					$("[sdswitchfstcopyside=success]").show();
					$("[sdswitchfstcopyside=error]").hide();
					$("#sdswitchfstcopysideSuccessState").html("Operational");
					$("#sdswitchfstcopysideSuccessFilename").parent().hide();
					$("#sdswitchfstcopysideSuccessSpeed").parent().hide();
					$("#sdswitchfstcopysideSuccessSize").parent().hide();
					$("#sdswitchfstcopysideSuccessTime").parent().hide();
					$("#sdswitchfstcopysideProgress").hide();
					$("#sdswitchfstcopysideSuccessFilename").html("-");
					$("#sdswitchfstcopysideErrorFilename").html("-");
					$("#sdswitchfstcopysideSuccessSpeed").html("-");
					$("#sdswitchfstcopysideSuccessTime").html("-");
					$("#sdswitchfstcopysideErrorInfo").html("-");
				} else if (data == "force BOARD") {
					$("[isdswitchfstcopy=error]").show();
					$("[isdswitchfstcopychild=conf]").hide();
					$("[isdswitchfstcopychild=GPIO]").show();
					$("[sdswitchfstcopyErrorText=sub]").html("BCM");
					$("[isdswitchfstcopy=success]").hide();
					$("#sdswitchfstcopysideloader").hide();
				} else if (data == "force BCM") {
					$("[isdswitchfstcopy=error]").show();
					$("[isdswitchfstcopychild=conf]").hide();
					$("[isdswitchfstcopychild=GPIO]").show();
					$("[sdswitchfstcopyErrorText=sub]").html("BOARD");
					$("[isdswitchfstcopy=success]").hide();
					$("#sdswitchfstcopysideloader").hide();
				}
		}
		
		self.checkStatus = function() {
            $.ajax({
                url: API_BASEURL + "plugin/sdswitchfastcopy",
                type: "POST",
                data: JSON.stringify({
                    command: "status"
                }),
				context:this,
                contentType: "application/json; charset=UTF-8"
            }).done(function(data, textStatus, jqXHR ){
				this.checkStatusAction(data);
			}).fail(function( jqXHR, textStatus, errorThrown ) {
				if (this.timeoutTry != -1) {
					clearTimeout(this.timeoutTry);
				}
				this.timeoutTry = setTimeout(function (current) {current.checkStatus();}, 1000, this);
			});
        }; 
		
		self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "sdswitchfastcopy" && plugin != "octoprint_sdswitchfastcopy") {
                return;
            }
			if (data['status'] == "configFailed") {
				$("[isdswitchfstcopy=error]").show();
				$("[isdswitchfstcopychild=conf]").hide();
				$("[isdswitchfstcopychild=GPIO]").hide();
				$("[isdswitchfstcopy=success]").hide();
				$("#sdswitchfstcopysideloader").hide();
			}
			if (data['status'] == "callStatus") {
				 self.checkStatus();
			}
			else if (data['status'] == "init")
			{
				$("[isdswitchfstcopy=success]").show();
				$("#sdswitchfstcopysideloader").hide();
				$("[sdswitchfstcopyside=success]").show();
				$("[sdswitchfstcopyside=error]").hide();
				if (data['success'] == "remove")
					$("#sdswitchfstcopysideSuccessState").html("Remove file on sd");
				else if (data['success'] == "format")
					$("#sdswitchfstcopysideSuccessState").html("Format sd");
				else
					$("#sdswitchfstcopysideSuccessState").html("Operational");
				$("#sdswitchfstcopysideSuccessFilename").parent().hide();
				$("#sdswitchfstcopysideSuccessSpeed").parent().hide();
				$("#sdswitchfstcopysideSuccessSize").parent().hide();
				$("#sdswitchfstcopysideSuccessTime").parent().hide();
				$("#sdswitchfstcopysideProgress").hide();
				$("#sdswitchfstcopysideSuccessFilename").html("-");
				$("#sdswitchfstcopysideErrorFilename").html("-");
				$("#sdswitchfstcopysideSuccessSpeed").html("-");
				$("#sdswitchfstcopysideSuccessTime").html("-");
				$("#sdswitchfstcopysideErrorInfo").html("-");
			}
			else if (data['status'] == "success")
			{
				if ($("#formatsdswitchfstcopy").attr("lock") == "socket" || $("#formatsdswitchfstcopy").attr("lock") == "none")
				{
					$("#formatsdswitchfstcopy").prop("disabled", true);
					$("#formatsdswitchfstcopy").attr("lock", "socket");
				}
				$("[isdswitchfstcopy=success]").show();
				if (data['success'] == "moduleFound")
				{
					$("#sdswitchfstcopysideSuccessState").html("Module found");
				}
				if (data['success'] == "copyDone")
				{
					$("#sdswitchfstcopysideSuccessState").html("Copy completed");
				}
				if (data['success'] == "remove")
				{
					$("#sdswitchfstcopysideSuccessState").html("Remove file in progress");
				}
				if (data['success'] == "formatStart")
				{
					$("#sdswitchfstcopysideSuccessState").html("Format sd in progress");
				}
				if (data['success'] == "formatEnd")
				{
					$("#sdswitchfstcopysideSuccessState").html("Format sd done");
				}
				if (data['success'] == "formatEndTriggerFile")
				{
					$("#sdswitchfstcopysideSuccessState").html("Add sdswitch file");
				}
				if (data['success'] == "formatEndFree")
				{
					$("#sdswitchfstcopysideSuccessState").html("Release of the card");
				}
				if (data['success'] == "formatDone")
				{
					$("#sdswitchfstcopysideSuccessState").html("Format sd completed");
					if ($("#formatsdswitchfstcopy").attr("lock") == "socket")
					{
						$("#formatsdswitchfstcopy").prop("disabled", false);
						$("#formatsdswitchfstcopy").attr("lock", "none");
					}
				}
				if (data['success'] == "removeDone")
				{
					$("#sdswitchfstcopysideSuccessState").html("Remove file completed");
					if ($("#formatsdswitchfstcopy").attr("lock") == "socket")
					{
						$("#formatsdswitchfstcopy").prop("disabled", false);
						$("#formatsdswitchfstcopy").attr("lock", "none");
					}
				}
				if (data['success'] == "returnToPrinter")
				{
					$("#sdswitchfstcopysideSuccessState").html("Sd back on the printer");
				}
				if (data['success'] == "searchModule")
				{
					$("#sdswitchfstcopysideSuccessState").html("Search module");
				}
				if (data['success'] == "copyStart")
				{
					$("#sdswitchfstcopysideSuccessState").html("Copy in progress");
					$("#sdswitchfstcopysideProgress").show();
				} else {
					$("#sdswitchfstcopysideProgress").hide();
				}
				if (data['success'] == "done")
				{
					$("#sdswitchfstcopysideSuccessState").html("Processing completed");
					if ($("#formatsdswitchfstcopy").attr("lock") == "socket")
					{
						$("#formatsdswitchfstcopy").prop("disabled", false);
						$("#formatsdswitchfstcopy").attr("lock", "none");
					}
				}
				if (data['speed'] != "")
				{
					$("#sdswitchfstcopysideSuccessSpeed").html(data['speed']);
					$("#sdswitchfstcopysideSuccessSpeed").parent().show();
				} else {
					$("#sdswitchfstcopysideSuccessSpeed").parent().hide();
				}
				if (data['time'] != "")
				{
					$("#sdswitchfstcopysideSuccessTime").html(data['time']);
					$("#sdswitchfstcopysideSuccessTime").parent().show();
				} else {
					$("#sdswitchfstcopysideSuccessTime").parent().hide();
				}
				if (data['size'] != "")
				{
					$("#sdswitchfstcopysideSuccessSize").html(data['size']);
					$("#sdswitchfstcopysideSuccessSize").parent().show();
				} else {
					$("#sdswitchfstcopysideSuccessSize").parent().hide();
				}
				if (data['filename'] != "")
				{
					$("#sdswitchfstcopysideSuccessFilename").html(data['filename']);
					$("#sdswitchfstcopysideSuccessFilename").parent().show();
				} else {
					$("#sdswitchfstcopysideSuccessFilename").parent().hide();
				}
			}
			else if (data['status'] == "error")
			{
				if ($("#formatsdswitchfstcopy").attr("lock") == "socket")
				{
					$("#formatsdswitchfstcopy").prop("disabled", false);
					$("#formatsdswitchfstcopy").attr("lock", "none");
				}
				$("[isdswitchfstcopy=success]").show();
				$("[sdswitchfstcopyside=success]").hide();
				$("[sdswitchfstcopyside=error]").show();
				if (data['filename'] != "")
				{
					$("#sdswitchfstcopysideErrorFilename").html(data['filename']);
					$("#sdswitchfstcopysideErrorFilename").parent().show();
				} else {
					$("#sdswitchfstcopysideErrorFilename").parent().hide();
				}
				if (data['error'] == "moduleNotFound")
				{
					$("#sdswitchfstcopysideErrorInfo").html("Module not found");
				}
				if (data['error'] == "sdNotReturn")
				{
					$("#sdswitchfstcopysideErrorInfo").html("Failure to transfer the sd to the printer");
				}
				if (data['error'] == "copyFailed")
				{
					$("#sdswitchfstcopysideErrorInfo").html("Failed to copy the file to the sd card");
				}
				if (data['error'] == "removeFailedRelease")
				{
					$("#sdswitchfstcopysideErrorInfo").html("File remove: failed release SD card, please release manually");
				}
				if (data['error'] == "formatFailedRelease")
				{
					$("#sdswitchfstcopysideErrorInfo").html("Format SD: failed release SD card, please release manually");
				}
			}
			
        }
    }
    OCTOPRINT_VIEWMODELS.push([
        SdSwitchFastCopyViewModel,
        ["loginStateViewModel", "settingsViewModel", "printerStateViewModel"],
        document.getElementById("sidebar_plugin_sdswitchfastcopy")
    ]);
});
