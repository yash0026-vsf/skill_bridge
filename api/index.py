import os
import sys

# Ensure root directory is in sys.path
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root not in sys.path:
    sys.path.insert(0, root)

try:
    from statskill_backend import app
except Exception as e:
    from fastapi import FastAPI
    app = FastAPI(title='StatSkill Fallback')
    @app.get('/api/health')
    def health():
        return {'status': 'error', 'detail': str(e)}
