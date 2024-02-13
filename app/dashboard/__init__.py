import os
import subprocess
from pathlib import Path

from config import DEBUG, VITE_BASE_API

path = '/dashboard/'
base_dir = Path(__file__).parent
build_dir = base_dir / 'build'


def build():
    proc = subprocess.Popen(
        ['npm', 'run', 'build', '--', '--base', path,  '--outDir', build_dir],
        env={**os.environ, 'VITE_BASE_API': VITE_BASE_API},
        cwd=base_dir
    )
    proc.wait()
    with open(build_dir / 'index.html', 'r') as file:
        html = file.read()
    with open(build_dir / '404.html', 'w') as file:
        file.write(html)