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

#import tldextract

from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify, Response
#from flask.ext.assets import Environment, Bundle
from flask_oauth import OAuth
from flask.ext.gzip import Gzip

from werkzeug.security import generate_password_hash, \
    check_password_hash

import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

import redis

from cloudinary import uploader #pip install git+https://github.com/cloudinary/pycloudinary/

r = redis.StrictRedis.from_url(os.getenv('REDISCLOUD_URL', 'redis://127.0.0.1:6379'))
if (not r):
    sys.exit(1)

from pprint import pprint
from inspect import getmembers

from RedisSessionStore import *

app = MyFlask(__name__, static_folder='static', static_url_path='')
# session params
app.config['SESSION_REDIS_HOST'] = os.getenv('REDISCLOUD_URL', 'redis://127.0.0.1:6379')
app.config['SESSION_REDIS_DB'] = 1

app.config['SESSION_KEY'] = '3425234535'
app.config['SESSION_KEY_PREFIX'] = 'session_myapp_'

app.config['SESSION_LIFETIME'] = 86400 * 20

RedisSessionStore.init_app(app)

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

@app.route('/api/friends', methods=['POST'])
def addfriends():
    friends = dict(request.form)
    user = friends['me']
    me = user[0]
    friends = friends['friends[]']
    for friend in friends:
        #print "user:"+me+":friends"
        r.sadd("user:"+me+":friends", friend)
        r.sadd("user:"+friend+":friends", me)
    return jsonify({'status': "ok" })


@app.route('/api/like', methods=['POST'])
def like():

    if request.method == "POST":
        public_id = request.form['public_id']
        like_type = request.form['like_type']

        #hincrby likes:post2 otstoy 1
        r.hincrby('likes:'+public_id, like_type, 1)
        return jsonify({'status': "ok" })

    else:
        return jsonify({'status': "err", 'error': 'Rwong method!'})


"""
@app.route("/vote/postid", methods=['POST'])
def vote():

    if request.method == "POST":
        sender = request.form['from']
        receiver = request.form['to']

    #r.hset('allposts', res['cloudinary']['public_id'], json.dumps(res))
    else:
        return jsonify({'status': "err", 'error': 'Rwong method!'})
"""

def load_post(post_id):
    post = r.hget('allposts', post_id)
    post = json.loads(post)

    likes = r.hgetall('likes:' + post_id)
    for like_type in likes.keys():
        post[like_type] = likes[like_type]
    post['replies'] = r.zcard('thread:' + post_id)
    #print post
    return post


@app.route('/<userid>/friends')
def friends(userid):
    #a = r.ltrim("user:"+userid+":friends", 0, 10)  #LTRIM actistrm:<user-id> 0 1000
    a = r.lrange("feed:"+userid, 0, 10)  #LTRIM actistrm:<user-id> 0 1000
    posts = []
    if not a:
        a = []
    for public_id in a:
        post = load_post(public_id)
        posts.append(post)
    #print posts
    selected = 'friends'
    print 'SELECTED is'
    print posts
    return render_template('home.html', userid=userid, posts=posts, selected=selected)

@app.route('/thread/<public_id>')
def thread(public_id):
    posts= []
    post = r.hget('allposts', public_id)
    post = json.loads(post)
    posts.append(post)
    #print posts
    a = r.zrevrange('thread:' + public_id, 0, -1)
    for pid in a:
        post = load_post(pid)
        posts.append(post)
    return render_template('home.html', posts=posts, reply_to=public_id)


@app.route('/', defaults={'userid' : 'all'})
@app.route('/<userid>')
def index(userid):

    a = []
    if userid == 'all':
        a = r.zrevrange('allpics', 0, -1)
    else:
        a = r.zrevrange('wall:'+userid, 0, -1)

    posts = []
    if not a:
        a = []
    for public_id in a:
        post = load_post(public_id)
        posts.append(post)
    #print posts
    selected = False
    if (userid == 'all'):
        selected = 'last'
    return render_template('home.html', userid=userid, posts=posts, selected=selected)


@app.route("/post", methods=['POST', 'GET'])
def post():
  print "FORM!!"
  print request.form

  post_type = 'post'

  if request.method == "POST":
    if 'image' not in request.files:
        return jsonify({'status': "err", 'error': 'No image!'})
    if 'from' not in request.form:
        return jsonify({'status': "err", 'error': 'No from!'})
    if 'to' not in request.form:
        return jsonify({'status': "err", 'error': 'No to!'})
    if 'reply' in request.form:
        post_type = 'reply'

    sender = request.form['from']
    receiver = request.form['to']
    print 'RECEIVER IS', receiver
    response = cloudinary.uploader.upload(request.files['image'])

    #return jsonify({'status': "err", 'error': 'Not authenticated.'})
    res = { 'sender' : sender, 'receiver' : receiver, 'cloudinary' : response, 'time' : int(time())}
    if 'anonymous' in request.form:
        res['anonymous'] = 1

    #print r.lrange("user:"+sender+":friends", 0, -1)
    r.hset('allposts', res['cloudinary']['public_id'], json.dumps(res))

    if (post_type == 'reply'):
        print "REPLY TTT ", request.form['reply']
        r.zadd('thread:'+ request.form['reply'], int(time()), res['cloudinary']['public_id'])
        print "ADD REPLY!! \n\n\n"
    else:
        friends = r.smembers("user:"+receiver+":friends")
        for friend in friends:
            print 'PUSHING TO FEED', friend
            r.lpush('feed:' + friend, res['cloudinary']['public_id'])
        r.zadd('wall:'+receiver, int(time()), res['cloudinary']['public_id'])
        r.zadd('allpics', int(time()), res['cloudinary']['public_id'])

    return redirect(request.referrer)

  else:
      return jsonify({'status': "err", 'error': 'Rwong method!'})


"""
{u'secure_url': u'https://res.cloudinary.com/ummwut/image/upload/v1376132166/1001.gif', u'public_id': u'1001', u'format': u'gif', u'url': u'http://res.cloudinary.com/ummwut/image/upload/v1376132166/1001.gif', u'created_at': u'2013-08-10T10:56:06Z', u'bytes': 614274, u'height': 302, u'width': 288, u'version': 1376132166, u'signature': u'573f5b4a5947a0f185371f559c7d96cb3071ee36', u'type': u'upload', u'pages': 40, u'resource_type': u'image'}
"""


