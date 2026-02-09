from http.server import SimpleHTTPRequestHandler
from http.server import HTTPServer
import json
from urllib.parse import urlparse, parse_qs

from reed_kellogg import parse_sentence


class HttpGetHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header("Content-type", "application/json")
        self.end_headers()
        url = urlparse(self.path)

        if url.path == '/sentence-syntax-tree':
            queries = parse_qs(url.query)

            if "sentence" in queries:
                sentence = queries["sentence"][0]
                sent_list = parse_sentence(sentence)
                response = json.dumps(sent_list).encode('utf-8')
                self.wfile.write(response)


def run(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, HttpGetHandler)
    try:
        print('Run server in port:', port)
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('Close server')
        httpd.server_close()


if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
