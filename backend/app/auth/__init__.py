from flask import Blueprint, session, redirect, url_for, request, current_app
import requests

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/login')
def login():
    """Redirect to Square SSO login."""
    return redirect(f"https://sso.squareup.com/authorize?client_id={current_app.config['SQUARE_SSO_CLIENT_ID']}&response_type=code&redirect_uri={current_app.config['SQUARE_SSO_REDIRECT_URI']}")

@bp.route('/callback')
def callback():
    """Handle Square SSO callback."""
    code = request.args.get('code')
    if not code:
        return 'Error: No code received', 400

    # Exchange code for token
    response = requests.post('https://sso.squareup.com/token', data={
        'client_id': current_app.config['SQUARE_SSO_CLIENT_ID'],
        'client_secret': current_app.config['SQUARE_SSO_CLIENT_SECRET'],
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': current_app.config['SQUARE_SSO_REDIRECT_URI']
    })

    if response.status_code != 200:
        return 'Error: Failed to get token', 400

    token_data = response.json()
    session['access_token'] = token_data['access_token']
    
    # Get user info
    user_response = requests.get('https://sso.squareup.com/userinfo', headers={
        'Authorization': f"Bearer {token_data['access_token']}"
    })

    if user_response.status_code == 200:
        user_data = user_response.json()
        session['user'] = {
            'email': user_data['email'],
            'name': user_data.get('name', ''),
            'employee_id': user_data.get('employee_id', '')
        }

    return redirect('/')

@bp.route('/logout')
def logout():
    """Clear session data."""
    session.clear()
    return redirect('/')

def login_required(view):
    """Decorator to require login for views."""
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if 'user' not in session:
            return redirect(url_for('auth.login'))
        return view(**kwargs)
    return wrapped_view
