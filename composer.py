import socketio
import time
import random
sioc = socketio.Client()

lastSelfCmdTime=0
lastCmdTime=time.time()
cmdDelay=3
autoDelay=60*10

@sioc.on('connect')
def on_connect():
    print('connection established')

@sioc.on('Servorcmd')
def on_cmd(data):
    global lastCmdTime
    print('message received with ', data)
    lastCmdTime=time.time()

@sioc.on('disconnect')
def on_disconnect():
    print('disconnected from server')

def run_composer():
    sioc.connect('http://localhost:3000')
    while True:
        if(time.time()-lastCmdTime>autoDelay):
            compose()
        time.sleep(1)

def compose():
    global lastSelfCmdTime,cmdDelay
    if (time.time()-lastSelfCmdTime>cmdDelay):
        line=createLine()
        sioc.emit('autocmd',line)
        lastSelfCmdTime=time.time()
        cmdDelay=random.randint(5,15)

def createLine():
    max=26
    id =[random.randint(0,max),random.randint(0,6)]
    while id[0]+id[1]>max:
        id[1]-=1
    freq=[round(random.random()*400+40,2),round(random.random()*2,3)]
    vol=round(random.random()*5+10)
    line=str(id[0])+"<"+str(id[0]+id[1])+" "+str(freq[0])+"+"+str(freq[1])+" "+str(vol)
    print(line)
    return line
