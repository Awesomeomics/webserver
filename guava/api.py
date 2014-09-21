#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
import settings

class GuavaAPI:

    def __init__(self, url=settings.GUAVA_API_URL):
        self.url = url

    def _post_request(self, endpoint, payl):
        url = '/'.join([self.url, endpoint])
        headers = {'content-type': 'application/json'}
        r = requests.post(url, data=json.dumps(payl), headers=headers)
        if r.status_code / 100 == 2:    
            return None, r.json()
        try:
            return r.json(), None
        except:
            return {'code': r.status_code}, None

    def login(self, email, password):
        payl =  {'email': email, 'password': password}
        return _post_request('auth/email', payl)

    def signup(self, firstname, lastname, email, password):
        payl = {'firstname': firstname, 'lastname': lastname,
                'email': email, 'password': password}

        return _post_request('client', payl)
