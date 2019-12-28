# Diagramming Sentences

В поле ввода вводится предложение на английском. Дальше предложение обрабатывается - слова разделяются и между ними устанавливается связь на основе грамматики английского языка. После обработки связи рисуются по правилам Рида и Келлога.

## Зависимости:

1. Tornado
   sudo pip3 install Tornado

2. Spacy
   sudo pip3 install spacy

3. Spacy english model
   python3 -m spacy download en

## Запуск:

1. Переименовать файл config.example на config.json
2. В config.json задать свои значения:<br/>
   "server-protocol": "http://", - протокол сервера<br/>
   "server-port": "80", - порт сервера<br/>
   "server-ip": "localhost", - адресс сервера<br/>
   "debug": "false" - для правильной работы скрипта это значение не рекомендуется менять

3. Выполнить команду в терминале: sudo python3 server.py
4. Запустить один из браузеров: Google Chrome 64, Mozilla Firefox 58, Microsoft Edge 16
5. Перейти по адресу server-protocol + server-ip + ':' + server-port
