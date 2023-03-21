from flask import Flask, g, request, jsonify
from functools import wraps
import sqlite3
import string
import random

app = Flask(__name__)
def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect('db/belay.sqlite3')
        db.row_factory = sqlite3.Row
        setattr(g, '_database', db)
    return db

def query_db(query, args=(), one=False):
    db = get_db()
    cursor = db.execute(query, args)
    rows = cursor.fetchall()
    db.commit()
    cursor.close()
    if rows:
        if one: 
            return rows[0]
        return rows
    return None

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def new_user():
    name = "Unnamed User #" + ''.join(random.choices(string.digits, k=6))
    password = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    u = query_db('insert into users (name, password, api_key) ' + 
        'values (?, ?, ?) returning id, name, password, api_key',
        (name, password, api_key),
        one=True)
    return u

@app.route('/', methods=['GET'])
def index():
    # dont render templaye, just static html
    return app.send_static_file('belay.html')


@app.route('/login')
def login_():
    return app.send_static_file('belay.html')


@app.route('/channel/<string:channel_id>')
def channels_(channel_id):
    return app.send_static_file('belay.html')

@app.route('/channel/<string:channel_id>/thread/<int:thread_id>', methods=['GET'])
def threads_(channel_id, thread_id):
    return app.send_static_file('belay.html')

@app.route('/signup')
def signup_():
    return app.send_static_file('belay.html')

@app.route('/thread/<int:thread_id>', methods=['GET'])
def thread_only_(thread_id):
    return app.send_static_file('belay.html')



# -------------------------------- API ROUTES ----------------------------------

@app.route('/api/listchannels', methods=['GET'])
def listchannels():
    # return jsonify([{"uuid": 1, "name": "channel1"}, {"uuid": 2, "name": "channel2"}])
    if request.method == 'GET':
        print("LIST CHANNELS")
        # authenticate user
        if  ("api_key" in request.headers) and (request.headers['api_key']!=None):
            print("api_key: ", request.headers['api_key'])
            api_key = request.headers['api_key']
            u = query_db('select * from users where api_key = ?', [api_key], one=True)
            if not u:
                return jsonify({'error': 'Invalid API key'}), 401

            user_id = u['id']
            username = u['name']
            # print("AUTHENTICATED USER: ", username)
        else:
            return jsonify({'error': 'No API key'}), 401

        channels = query_db('select * from channels')
        channels_list = []

        for channel in channels:
            # print(channel)
            channels_list.append({'uuid': channel['uuid'], 'name': channel['name']})
        return jsonify(channels_list)

    return jsonify({'error': 'Invalid request'}), 401
    


@app.route('/api/signup', methods=['POST'])
def signup():
    body = request.get_json()
    # print(body)
    if body and 'name' in body and 'password' in body:
        api_key = ''.join(random.choices(string.ascii_lowercase + string.digits, k=40))
        u = query_db('insert into users (name, password, api_key) ' + 'values (?, ?, ?) returning id, name, password, api_key', (body['name'], body['password'], api_key), one=True)
        resp = {
            'id': u['id'],
            'name': u['name'],
            'api_key': u['api_key']
        }
        return jsonify(resp)
    else:
        return jsonify({'error': 'Invalid request'}), 401

@app.route('/api/login', methods=['POST'])
def login_user():
    # print(request.headers)
    if request.method == 'POST':
        if  ("api_keys" in request.headers) and (request.headers['api_key']!=None):
            return request.headers['api_key'], 200
        elif 'name' not in request.json or 'password' not in request.json:
            return jsonify({'error': 'No username or password entered'}), 401

        u = query_db('select * from users where name = ? and password = ?',(request.json['name'], request.json['password']), one=True)
        # # print(request,"POST")

        if u:
            return {'id': u['id'], 'name': u['name'], 'password': u['password'], 'api_key': u['api_key']}, 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401


@app.route('/api/listmessages/<string:channel_id>', methods=['GET'])
def listmessages(channel_id):
    if request.method == 'GET':
        if  ("api_key" in request.headers) and (request.headers['api_key']!=None):
            # print("api_key: ", request.headers['api_key'])
            api_key = request.headers['api_key']
            u = query_db('select * from users where api_key = ?', [api_key], one=True)
            if not u:
                return jsonify({'error': 'Invalid API key'}), 401

            user_id = u['id']
            username = u['name']
            # print("AUTHENTICATED USER: ", username)
        else:
            return jsonify({'error': 'No API key'}), 401
        

        messages = query_db('select messages.id, messages.body, messages.user_id, messages.channel_id, users.name from messages left join users on messages.user_id=users.id where channel_id = ? and reply_to is NULL', [channel_id])
        messages_list = []


        if messages:
            for message in messages:
                messages_list.append({'id': message['id'], 'body': message['body'], 'user_id': message['user_id'], 'channel_id': message['channel_id'], 'name': message['name']})
        return jsonify(messages_list)

    return jsonify({'error': 'Invalid request'}), 401

@app.route('/api/replycount/<string:channel_id>', methods=['GET'])
def replycount(channel_id):
    if request.method == 'GET':
        if  ("api_key" in request.headers) and (request.headers['api_key']!=None):
            # print("api_key: ", request.headers['api_key'])
            api_key = request.headers['api_key']
            u = query_db('select * from users where api_key = ?', [api_key], one=True)
            if not u:
                return jsonify({'error': 'Invalid API key'}), 401

            user_id = u['id']
            username = u['name']
            # print("AUTHENTICATED USER: ", username)
        else:
            return jsonify({'error': 'No API key'}), 401
    # print(channel_id)
        reply_count = query_db('select reply_to, count(1) from messages where reply_to is not NULL and channel_id = ? group by reply_to', [channel_id])
        # print(reply_count)
        reply_count_list = []

        if reply_count:
            for reply in reply_count:
                # print(reply)
                # array with 2 elements, reply_to and count
                reply_count_list.append({'reply_to': reply['reply_to'], 'count': reply['count(1)']})
        # print(reply_count_list)
        return jsonify(reply_count_list)

    return jsonify({'error': 'Invalid request'}), 401


@app.route('/api/postmessages/<string:channel_id>', methods=['POST'])
def postmessages(channel_id):
    # print(channel_id)
    # # # print(request.json)
    if request.method == 'POST':
        if  ("api_key" in request.headers) and (request.headers['api_key']!=None):
            # print("api_key: ", request.headers['api_key'])
            api_key = request.headers['api_key']
            u = query_db('select * from users where api_key = ?', [api_key], one=True)
            if not u:
                return jsonify({'error': 'Invalid API key'}), 401

            user_id = u['id']
            username = u['name']
            # # print("AUTHENTICATED USER: ", username)
        else:
            return jsonify({'error': 'No API key'}), 401
        body = request.json['body']


        message = query_db('insert into messages (body, user_id, channel_id) ' + 'values (?, ?, ?) returning id, body, user_id, channel_id', [body, user_id, channel_id], one=True)

        return jsonify({'id': message['id'], 'body': message['body'], 'user_id': message['user_id'], 'channel_id': message['channel_id']})

    return jsonify({'error': 'Invalid request'}), 401


@app.route('/api/listreplies/<string:channel_id>/<string:message_id>', methods=['GET'])
def listreplies(channel_id, message_id):
    # # print(channel_id)
    if request.method == 'GET':
        if  ("api_key" in request.headers) and (request.headers['api_key']!=None):
            # print("api_key: ", request.headers['api_key'])
            api_key = request.headers['api_key']
            u = query_db('select * from users where api_key = ?', [api_key], one=True)
            if not u:
                return jsonify({'error': 'Invalid API key'}), 401

            user_id = u['id']
            username = u['name']
            # print("AUTHENTICATED USER: ", username)
        else:
            return jsonify({'error': 'No API key'}), 401
        messages = query_db('select messages.id, messages.body, messages.user_id, messages.channel_id, users.name from messages left join users on messages.user_id=users.id  where channel_id = ? and reply_to is not NULL and reply_to = ?', [channel_id, message_id])
        messages_list = []

        if messages:
            for message in messages:
                # print(message)
                messages_list.append({'id': message['id'], 'body': message['body'], 'user_id': message['user_id'], 'channel_id': message['channel_id'], 'name': message['name']})
        return jsonify(messages_list)

    return jsonify({'error': 'Invalid request'}), 401


@app.route('/api/postreply/<string:channel_id>/<string:message_id>', methods=['POST'])
def postreply(channel_id, message_id):
    if request.method == 'POST':
        if  ("api_key" in request.headers) and (request.headers['api_key']!=None):
            # print("api_key: ", request.headers['api_key'])
            api_key = request.headers['api_key']
            u = query_db('select * from users where api_key = ?', [api_key], one=True)
            if not u:
                return jsonify({'error': 'Invalid API key'}), 401

            user_id = u['id']
            username = u['name']
            # print("AUTHENTICATED USER: ", username)
        else:
            return jsonify({'error': 'No API key'}), 401

        body = request.json['body']
        user_id = 'user_1'

        message = query_db('insert into messages (body, user_id, channel_id, reply_to) ' + 'values (?, ?, ?, ?) returning id, body, user_id, channel_id, reply_to', [body, user_id, channel_id, message_id], one=True)

        return jsonify({'id': message['id'], 'body': message['body'], 'user_id': message['user_id'], 'channel_id': message['channel_id'], 'reply_to': message['reply_to']})

@app.route('/api/thread/<int:message_id>', methods=['GET'])
def thread_only(message_id):
    if request.method == 'GET':
        if  ("api_key" in request.headers) and (request.headers['api_key']!=None):
            # print("api_key: ", request.headers['api_key'])
            api_key = request.headers['api_key']
            u = query_db('select * from users where api_key = ?', [api_key], one=True)
            if not u:
                return jsonify({'error': 'Invalid API key'}), 401

            user_id = u['id']
            username = u['name']
            # print("AUTHENTICATED USER: ", username)
        else:
            return jsonify({'error': 'No API key'}), 401

        # get the message
        message = query_db('select messages.id, messages.body, messages.user_id, messages.channel_id, users.name from messages left join users on messages.user_id=users.id  where messages.id = ?', [message_id], one=True)
    
        return jsonify({'id': message['id'], 'body': message['body'], 'user_id': message['user_id'], 'channel_id': message['channel_id'], 'name': message['name']})
    
    return jsonify({'error': 'Invalid request'}), 401


@app.route('/api/unreadmessages', methods=['GET'])
def unreadmessages():

    # should return a list of channels with unread messages
    if request.method == 'GET':
        if  ("api_key" in request.headers) and (request.headers['api_key']!=None):
            # print("api_key: ", request.headers['api_key'])
            api_key = request.headers['api_key']
            u = query_db('select * from users where api_key = ?', [api_key], one=True)
            if not u:
                return jsonify({'error': 'Invalid API key'}), 401

            user_id = u['id']
            username = u['name']
            # print("AUTHENTICATED USER: ", username)
        else:
            return jsonify({'error': 'No API key'}), 401
    # get all channels
        # channels = query_db('select * from channels')
        # channels_list = []

        channel_ids = query_db('select distinct uuid from channels')

        list_latest_message_ids = []
        for channel in channel_ids:
            print(channel['uuid'])
            latest_message = query_db('select message_id from unread where channel_id = ? and user_id = ? order by  desc limit 1', [channel['uuid']])
            # print(latest_message)
            latest_message_id = latest_message['message_id'] 

            list_latest_message_ids.append({'channel_id': channel, 'latest_message_id': latest_message_id})
        # returns a list of latest message ids
        print(list_latest_message_ids)
        return jsonify(list_latest_message_ids)
    
    return jsonify({'error': 'Invalid request'}), 401



# POST to change the user's name
@app.route('/api/users/changename', methods=['POST'])
def change_user_name():
    api_key = request.headers.get('api_key')
    # check if api key is valid from database and return user
    user = query_db('select * from users where api_key = ?', [api_key], one=True)
    # print("user['id']", user['id'])
    # user['id'] = 20
    # print("user", user)
    # print("user['name']", user["name"])
    if not user['id']:
        return {}, 403
    
    body = request.get_json()
    # name = request.json['name']
    name = body['name'] 
    # print("name, user['id']", name, user['id'])
    query_db('update users set name = ? where id = ?', [name, user['id']])
    # print("UPDATED user['name']", user["name"])
    return {}, 200

# POST to change the user's password
@app.route('/api/users/changepassword', methods=['POST'])
def change_user_password():
    # METHOD 2 : Manually check the api key
    api_key = request.headers.get('api_key')
    # print(api_key)
    # check if api key is valid from database and return user
    user = query_db('select * from users where api_key = ?', [api_key], one=True)
    if not user['id']:
        return {}, 403
    

    password = request.json['password']
    query_db('update users set password = ? where id = ?', [password, user['id']])
    return {}, 200

@app.route('/api/create_channel', methods=['POST'])
def create_channel():
    # authentification
    if request.method == 'POST':
        api_key = request.headers.get('api_key')
        # check if api key is valid from database and return user
        user = query_db('select * from users where api_key = ?', [api_key], one=True)
        print("user['id']", user['id'])
        # user['id'] = 20
        print("user", user)
        print("user['name']", user["name"])
        if not user['id']:
            return {}, 403

        body = request.get_json()
        channel_name = request.json['name']
        print('insert into channels (uuid, name) values ({},{}) returning uuid, name'.format(''.join(random.choices(string.ascii_lowercase + string.digits, k=10)), channel_name))
        r = query_db('insert into channels (uuid, name) values (?,?) returning uuid, name', [ ''.join(random.choices(string.ascii_lowercase + string.digits, k=10)), channel_name], one=True)

        print("r", r)
        print(r['uuid'], r['name'])
        return jsonify({'uuid': r['uuid'], 'name': r['name']})

    return jsonify({'error': 'Invalid request'}), 401
