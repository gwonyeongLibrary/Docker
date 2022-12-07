from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '여기는 5000번 파이썬 서버입니다.'

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000,debug=True)