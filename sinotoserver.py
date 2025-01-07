
import eventlet
import socketio
import os
import time
import threading
from composer import*

sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'},
    '/CourierPrime.ttf':'public/data/CourierPrime.ttf',
    '/cour.ttf':'public/data/cour.ttf',
    '/style.css': 'public/style.css',
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
    print("nombre de personnes connectées",len(sids))

@sio.event
def disconnect(sid):
    global sids
    #print('disconnect')
    sids.remove(sid)
    print("nombre de personnes connectées",len(sids))

@sio.event
def cmd(sid, line):
    global lastCmdTime
    broadcast(sid,line)
    lastCmdTime=time.time();

@sio.event
def autocmd(sid, line):
    if (len(sids)>1):
        broadcast(sid,line)
        sent=False
        i=0
        while sent==False:
            if(sids[i]!=sid):
                print("autosave emit")
                sio.emit('autosave',"",room=sids[i])
                sent=True
            else:
                i+=1

def broadcast(sid,line):
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
composer = threading.Thread(target=run_composer, args=(),daemon=True)
composer.start()
eventlet.wsgi.server(eventlet.listen(('', 3000)), app)
