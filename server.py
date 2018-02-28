import tornado.ioloop
import tornado.web
import tornado.wsgi
import wsgiref.simple_server
import json
import os
from reed_kellogg import parse_sentence


print('Run server')


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        # self.render('index.html', debug=debug)
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
    # wsgi_app = tornado.wsgi.WSGIAdapter(application)
    # server = wsgiref.simple_server.make_server('', 8888, wsgi_app)
    # server.serve_forever()
    try:
        f = open('config.json','r')
        config = json.load(f)
        protocol = config['server-protocol']
        address = config['server-ip']
        port = config['server-port']
        debug = config['debug']
        host_url = protocol + address + ':' + port + '/'
        print(host_url)
    except Exception as e:
        print('Can not load file config.json:', e)
    else:
        print ('loading server')
        application.listen(int(port))
        print ('starting')
        tornado.ioloop.IOLoop.instance().start()
