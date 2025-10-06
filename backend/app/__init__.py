from flask import Flask
from flask_cors import CORS
from . import auth
from .api import inventory

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load configuration
    app.config.from_object('config.Config')

    # Register blueprints
    app.register_blueprint(auth.bp)
    app.register_blueprint(inventory.bp)

    return app
