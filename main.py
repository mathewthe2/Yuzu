import eel
import os
import threading

def close(page, sockets):
    if not sockets:
      os._exit(0)

def run_eel():
    eel.init('web', allowed_extensions=['.js', '.html', '.map'])
    eel.start('index.html',
    close_callback=close, 
    port=0
    )

main_thread = threading.Thread(target=run_eel, args=())
main_thread.start()