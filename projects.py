import os 
import re
import base64
from pathlib import Path
from glob import glob
from images import get_base64_image, get_image_type

bundle_dir = Path(__file__).parent
project_path = Path(bundle_dir, 'projects')

def get_project_list():
    list = [Path(item).name for item in glob(str(project_path) + '/*/')]
    return list

def get_project_data(project_name):
    images_path = Path(project_path, project_name, 'images')
    image_names = [f for f in os.listdir(images_path) if re.match('(\w+).(?:jpg|jpeg|png|tiff|webp)$', f)]
    image_names.sort(key=lambda f: int(re.sub('\D', '', f)))
    images = [
        {'name': file, 
        'data': get_base64_image(images_path, file),
        'format': get_image_type(file)
        } 
        for file in image_names]

    # TODO: get text positional and size data from text.yaml
    result = {
        'project': project_name,
        'path': str(Path(project_path, project_name)),
        'images': images
    }
    return result