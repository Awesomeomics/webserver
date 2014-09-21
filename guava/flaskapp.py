#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
sys.path.append('guava/')

import json

from flask import Flask, render_template, session, request, redirect
from sessions.session_interface import RedisSessionInterface

from api import GuavaAPI

import settings
import redis
import requests

r = redis.StrictRedis(host=settings.REDIS_HOST,
					  port=settings.REDIS_PORT,
					  db=settings.REDIS_DB,
					  password=settings.REDIS_PASSWORD)

app = Flask(__name__, static_url_path='')
app.config.from_pyfile('settings.py')
app.session_interface = RedisSessionInterface(redis=r)
app.api = GuavaAPI()


@app.route('/', methods=['GET'])
def index():

	if session.get('client'):
		print session['client']
		return render_template('app.html', access_token=session['client']['access_token'])

	error = session.get('error')
	if error:
		session['error'] = None

	return render_template('index.html', error=error)


@app.route('/login', methods=['POST'])
def login():
	
	data = request.form
	if not data:
		return redirect('/')

	email = data.get('email')
	password = data.get('password')

	if not email or not password:
		return redirect('/')

	err, access_token = app.api.login(email, password)
	if err:
		session['error'] = 'invalid credentials'
	else:
		session['client'] = access_token

	return redirect('/')

@app.route('/logout', methods=['GET'])
def logout():
	session['client'] = None
	return redirect('/')


@app.route('/signup', methods=['GET', 'POST'])
def signup():

	print 'SIGNING UP'

	if session.get('client'):
		return redirect('/')

	if request.method == 'GET':
		error = session.get('error')
		if error:
			session['error'] = None
		return render_template('register.html', error=error)

	data = request.form
	if not data:
		return redirect('/')

	email = data.get('email')
	password = data.get('password')
	firstname = data.get('firstname')
	lastname = data.get('lastname')

	print email
	print password
	print firstname
	print lastname

	if not email or not password or not firstname or not lastname:
		return redirect('/')

	err, access_token = app.api.signup(firstname, lastname, email, password)
	if err:
		session['error'] = 'unable to signup, please try again'
	else:
		session['client'] = access_token

	return redirect('/')


if __name__=='__main__':
	app.run(port=5555, debug=True)