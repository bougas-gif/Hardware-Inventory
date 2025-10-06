from flask import Flask
from flask_cors import CORS
from .api.inventory import bp as inventory_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(inventory_bp)
    
    return app
