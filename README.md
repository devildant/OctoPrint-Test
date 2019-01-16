# OctoPrint Shutdown Printer

this plugin makes it possible to accelerate the copy on SD (printer) since octoprint.

it is intended to make fast transfer to the printer's SD card via octoprint.

![Sidebar1](https://i.imgur.com/D3Q95Pn.png)

![Sidebar2](https://i.imgur.com/cIjxTZZ.png)

![Settings](https://i.imgur.com/uYKTYcE.png)

## Setup

Install via the bundled [Plugin Manager](https://github.com/foosel/OctoPrint/wiki/Plugin:-Plugin-Manager)
or manually using this URL:

    https://github.com/devildant/OctoPrint-SdSwitchFastCopy/archive/master.zip
	
## PI settings
### Step 1) connect to your pi in ssh

### Step 2) install library:
#### A) install the python library GPIO with command:
    ~/oprint/bin/pip install RPi.GPIO
#### B) install udisk2 with command:
    sudo apt-get install udisks2

![GPIO1](https://i.imgur.com/MGiiM3I.png)


### Step 3) Add permissions to mount and umout to allow execution without a password

- Run this command:

        sudo visudo

- Enter your password

![visudo1](https://i.imgur.com/IXvEk7z.png)

- Add the line below at the end of the file 

        pi   ALL=NOPASSWD:/bin/mount,/bin/umount,/usr/bin/udisksctl,/sbin/mkfs.fat
	
![visudo2](https://i.imgur.com/DnncX6V.png)

- Save with CTRL X then enter Y

### Step 4) restart your PI with command :
 
        sudo shutdown -r now

