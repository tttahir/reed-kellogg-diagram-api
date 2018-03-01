import tornado.ioloop
import tornado.web
import socket
import json
import os
from reed_kellogg import parse_sentence


print('Run server')


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html', debug=debug)

class ProcessSentenceHandler(tornado.web.RequestHandler):
    def post(self):
        sentence = self.get_argument('sentence', '')
        sent_list = parse_sentence(sentence)
        response = json.dumps(sent_list)
        print(response)
        self.write(response)


application = tornado.web.Application([
    (r'/', MainHandler),
    (r'/process', ProcessSentenceHandler)
    ],
    template_path = os.path.join(os.path.dirname(__file__), 'templates'),
    static_path = os.path.join(os.path.dirname(__file__), 'static'),
    autoreload = True,
    debug = True
)

if __name__ == '__main__':
    port = '80'
    debug = 'false'
    protocol = 'http://'
    
    try:
        f = open('config.json','r')
        config = json.load(f)
        port = config['server-port']
        debug = config['debug']
    except Exception as e:
        print('Can not load file config.json:', e)

    print('Loading server')
    application.listen(int(port))
    host_name = socket.gethostbyname(socket.gethostname())
    origin = protocol + host_name + ':' + port + '/'
    print('Running on:', origin)
    tornado.ioloop.IOLoop.instance().start()
