from flask import Flask
from flask_cors import CORS
from square_auth import SquareAuth

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize Square SSO
    auth = SquareAuth()
    auth.init_app(app)
    
    # Register blueprints
    from .api import api_bp
    app.register_blueprint(api_bp)
    
    return app
