import requests

res = requests.post('http://localhost:5000/api/v1/auth/login', json={'email':'admin@demo.com','password':'password123'})
print('STATUS', res.status_code)
try:
    print(res.json())
except Exception:
    print(res.text)
