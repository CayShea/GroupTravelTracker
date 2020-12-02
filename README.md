# Group Travel Tracker


## after git clone.

Frontend: 
- npm install
Backend: 
- start virtualenv
- pip install -r requirements.txt
- python manage.py migrate


## setup before
Ensure you have Python3 installed.

You should also install virtualenv for Python development within an isolated environment.

[Virtualenv - Installation](https://virtualenv.pypa.io/en/latest/installation.html#)

Optionally virtualenvwrapper extensions may also be installed.

[virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/install.html)

Ensure you have Docker installed which will also install docker-compose.

[Get Started with Docker](https://www.docker.com/get-started) - *Note* Be sure to enable Virtualization first if on Windows machine (within the BIOS)

If you are working on the UI you will also need to install Yarn.

[Yarn Installation](https://yarnpkg.com/lang/en/docs/install)


## tools

[POSTman Installation](https://www.postman.com/downloads/)

[Postgresql Installation](https://www.postgresql.org/download/)

[Postgresql GUI Installation](use pgAdmin included with above installation, or use dbeaver)


## then...

1) start a new Database within Postgresql

2) edit local_settings file to configure DB (if needed)

3) ```$ pip install -r requirements.txt```

4) ```$ python manage.py migrate```

5) ```$ yarn install (or use npm)```



### MAC steps:

[Homebrew for Mac](https://brew.sh/)
[Installing Python 3 on Mac OS X](https://docs.python-guide.org/starting/install3/osx/)

Set up your .bash_profile (go to bottom of this README file). If you're using ZSH, you will have to do
some different stuff, setting up .zshrc, compinit, etc. to get completion working nicely and what not.

### Set up your .bash_profile if needed.
```bash
vi ~/.bash_profile
# Paste in .bash_profile content below and save.
source ~/.bash_profile
```

```
