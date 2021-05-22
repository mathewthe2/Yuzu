import base64
from pathlib import Path

def get_base64_image(path, file_name):
    with open('{}/{}'.format(path, file_name), 'rb') as image_file:
        base64_bytes  = base64.b64encode(image_file.read())
    base64_image_string = base64_bytes.decode('utf-8')
    return base64_image_string

def get_image_type(file_name):
    return Path(file_name).suffix.split('.')[1]