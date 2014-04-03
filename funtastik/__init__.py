#!/usr/bin/python
# -*- coding: utf8

import os
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import datetime
from time import time
import json
#import bson


from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify, Response
#from flask.ext.assets import Environment, Bundle
from flask_oauth import OAuth
from flask.ext.gzip import Gzip
from flaskext.mysql import MySQL

from werkzeug.security import generate_password_hash, \
    check_password_hash

import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

import redis

from cloudinary import uploader #pip install git+https://github.com/cloudinary/pycloudinary/


from flaskext.mysql import MySQL
from flask.ext.pymongo import PyMongo
from pymongo import MongoClient

r = redis.StrictRedis.from_url(os.getenv('REDISTOGO_URL', 'redis://127.0.0.1:6379'))
if (not r):
    sys.exit(1)

from pprint import pprint
from inspect import getmembers

from RedisSessionStore import *

app = MyFlask(__name__, static_folder='static', static_url_path='')
# session params
app.config['SESSION_REDIS_HOST'] = os.getenv('REDISTOGO_URL', 'redis://127.0.0.1:6379')
app.config['SESSION_REDIS_DB'] = 1

app.config['SESSION_KEY'] = '3425234535'
app.config['SESSION_KEY_PREFIX'] = 'session_myapp_'

app.config['SESSION_LIFETIME'] = 86400 * 20


RedisSessionStore.init_app(app)
#mysql = MySQL()
#mysql.init_app(app)

#mongo = PyMongo(app)
mongo = MongoClient(os.getenv('MONGOHQ_URL', '127.0.0.1'))

# connect to another MongoDB server altogether
app.config['MONGO2_HOST'] = '95.85.22.116'
app.config['MONGO2_PORT'] = 27017
mongo2 = PyMongo(app, config_prefix='MONGO2')
#app.config[''] = 'mongodb://heroku:ewnQct-znVkleYYjaTA3gMrRS_RfB59ty_HvX28Y4knC-4mlUblyJph7rAF21lKTGZB5Syx9F-aD2Okl-JMiEw@oceanic.mongohq.com:10021/app23598021'



app.config.from_object(__name__)
app.config['SECRET_KEY'] = 'devkey'
# set the secret key.  keep this really secret:
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
app.config.update(SECRET_KEY=os.urandom(20))
if app.debug:
    from flaskext.lesscss import lesscss
    lesscss(app)
app.static_path = '/static'

gzapp = Gzip(app)

app.config['MAX_CONTENT_LENGTH'] = 16 * 16 * 1024 * 1024
app.config['CLOUDINARY_URL'] = "cloudinary://916694617537676:uBOf1k7Ot9sYMwq30AU0A0boXvY@hmtpkyvtl" #XXX: feel free to use this URL, upload whatever you like ;)


SECRET_KEY = 'development key'
DEBUG = True

app.config['DEBUG'] = True


@app.route('/api/like', methods=['POST'])
def like():

    if request.method == "POST":
        user_id = request.form['user']
        pic_id = request.form['picid']

        registered = mongo.db.users.find({'user': user_id}).count()
        print registered
        if (registered == 0):
            mongo.db.users.insert({'user': user_id})
        mongo.db.users.update({'user': user_id}, { '$push' : { 'favorites' : pic_id } })
        return jsonify({'status': "ok" })

    else:
        return jsonify({'status': "err", 'error': 'Rwong method!'})

@app.route('/api/next', methods=['GET'])
def next():

    if request.method == "POST":
        return jsonify({'status': "err", 'error': 'Rwong method!'})
    return jsonify({'res' : 'ok', 'data' : [ pic["cloudinary"] for pic in mongo2.db.funtastik.find({}).limit(-1).skip(10) ]})


@app.route('/api/favorites', methods=['GET'])
def favorites():

    if request.method == "POST":
        return jsonify({'status': "err", 'error': 'Rwong method!'})
    user_id = request.form['user']
    favorites = mongo.db.users.find_one({'user': user_id}, { 'favorites' : 1 })
    return jsonify(favorites)




@app.route('/')
def index():
    return render_template('home.html')

"""
{u'secure_url': u'https://res.cloudinary.com/ummwut/image/upload/v1376132166/1001.gif', u'public_id': u'1001', u'format': u'gif', u'url': u'http://res.cloudinary.com/ummwut/image/upload/v1376132166/1001.gif', u'created_at': u'2013-08-10T10:56:06Z', u'bytes': 614274, u'height': 302, u'width': 288, u'version': 1376132166, u'signature': u'573f5b4a5947a0f185371f559c7d96cb3071ee36', u'type': u'upload', u'pages': 40, u'resource_type': u'image'}
"""


