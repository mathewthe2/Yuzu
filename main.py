import eel
import os
import threading
from projects import get_project_list, get_project_data

def close(page, sockets):
    if not sockets:
      os._exit(0)

@eel.expose
def get_projects():
    return get_project_list()

@eel.expose
def get_project(project):
    return get_project_data(project)

def run_eel():
    eel.init('web', allowed_extensions=['.js', '.html', '.map'])
    eel.start('index.html',
    close_callback=close, 
    port=0
    )

main_thread = threading.Thread(target=run_eel, args=())
main_thread.start()