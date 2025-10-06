import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
    DEBUG = os.getenv('FLASK_ENV') == 'development'

    # CORS settings
    CORS_HEADERS = 'Content-Type'
    
    # Snowflake settings
    SNOWFLAKE_ACCOUNT = 'square'
    SNOWFLAKE_WAREHOUSE = 'ADHOC__MEDIUM'
    SNOWFLAKE_DATABASE = 'oracle_erp'
    SNOWFLAKE_SCHEMA = 'scm'
