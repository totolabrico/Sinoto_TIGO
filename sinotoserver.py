
import eventlet
import socketio
import os
import threading
import time

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'},
    '/CourierPrime.ttf':'public/data/CourierPrime.ttf',
    '/cour.ttf':'public/data/cour.ttf',
    '/style.css': 'public/style.css',
    #'/favicon.png':'public/favicon.png',
    '/favicon.png': {'content_type': 'image/png', 'filename': 'public/favicon.png'},
    '/socketiomin.js': 'public/lib/socketiomin.js',
    '/p5.js': 'public/lib/p5.js',
    '/p5.sound.js': 'public/lib/p5.sound.js',
    '/p5.dom.js': 'public/lib/p5.dom.js',
    '/saves.js': 'public/saves.js',
    '/sinoto.js': 'public/sinoto.js',
    '/clavier.js': 'public/clavier.js',
    '/instru.js': 'public/instru.js',
    '/commandes.js': 'public/commandes.js',
    '/fades.js': 'public/fades.js',
    '/timeline.js': 'public/timeline.js',
    '/solfege.js': 'public/solfege.js',
    '/composer.js': 'public/composer.js',
    '/recorder.js': 'public/recorder.js',
    '/arpegiator.js': 'public/arpegiator.js',
    '/guidedescommandes.html': 'public/guidedescommandes.html',

})

sids=[]

@sio.event
def connect(sid, environ):
    global sids
    #print('connect ')
    sids.append(sid)

@sio.event
def cmd(sid, line):
    for el in sids:
        if sid != el:
            sio.emit('Servorcmd', line,room=el)

@sio.event
def save(sid,name,data):
    print('save', name)
    with open('./sessions/'+name+'.txt', 'w') as f:
        f.write(data)
    #sio.emit('my event', {'data': 'foobar'}, room=user_sid)

@sio.event
def load(sid,name,type):
    #print(os.listdir("./sessions/"))
    print("load",name,type)
    if type=="all":
        name="set_"+name
    fileObject = open('./sessions/set_'+name+'.txt', 'r')
    data = fileObject.read()
    sio.emit('getData', data)
    #return data
    #print(data)

@sio.event
def disconnect(sid):
    global sids
    #print('disconnect')
    sids.remove(sids.index(sid))
    #print(sids)

def loop():
    while True:
        #print('loop')
        time.sleep(1)

x = threading.Thread(target=loop, args=(),daemon=True)
x.start()

eventlet.wsgi.server(eventlet.listen(('', 3000)), app)
