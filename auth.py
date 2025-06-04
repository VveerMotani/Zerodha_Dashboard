# auth.py
from flask import redirect, request, session, url_for
from kiteconnect import KiteConnect
import os

def initiate_login():
    kite = KiteConnect(api_key=os.getenv('KITE_API_KEY'))
    login_url = kite.login_url()
    return redirect(login_url)

def handle_callback():
    request_token = request.args.get('request_token')
    kite = KiteConnect(api_key=os.getenv('KITE_API_KEY'))
    
    data = kite.generate_session(
        request_token, 
        api_secret=os.getenv('KITE_API_SECRET')
    )
    
    session['access_token'] = data['access_token']
    session['user_id'] = data['user_id']
    
    return redirect(url_for('dashboard'))
