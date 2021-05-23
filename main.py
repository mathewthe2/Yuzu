import eel
import os
import threading
from projects import get_project_list, get_project_data
from clipboard import get_clipboard_text, paste_text_to_clipboard

def close(page, sockets):
    if not sockets:
      os._exit(0)

@eel.expose
def get_projects():
    return get_project_list()

@eel.expose
def get_project(project):
    return get_project_data(project)

@eel.expose
def get_clipboard():
    return get_clipboard_text()

@eel.expose
def paste_to_clipboard(text):
    return paste_text_to_clipboard(text)

def run_eel():
    eel.init('web', allowed_extensions=['.js', '.html', '.map'])
    eel.start('index.html',
    mode='chromium',
    height=600,
    width=1200,
    close_callback=close, 
    port=0
    )

main_thread = threading.Thread(target=run_eel, args=())
main_thread.start()