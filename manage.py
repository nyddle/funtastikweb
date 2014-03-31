# manage.py
# -*- encoding:utf-8 -*-
import os, sys
from flask import Flask
from flask.ext.script import Manager, Server, Command, Option
#import settings
from steena import app

#app.config.from_object(settings)
manager = Manager(app)
# Turn on debugger by default and reloader
manager.add_command("runserver", Server(
    use_reloader = True,
    port = int(os.environ.get('PORT', 5000)),
    host = '0.0.0.0')
)

if __name__ == "__main__":
        manager.run()


