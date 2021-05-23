import pyperclip

def get_clipboard_text():
    return pyperclip.paste()

def paste_text_to_clipboard(text):
    pyperclip.copy(text)