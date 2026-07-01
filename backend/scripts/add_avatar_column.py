import os
import pymysql

DB_USER = os.environ.get('DB_USER', 'billbook')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'billbook')
DB_HOST = os.environ.get('DB_HOST', '127.0.0.1')
DB_PORT = int(os.environ.get('DB_PORT', '3306'))
DB_NAME = os.environ.get('DB_NAME', 'billbook')

conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db=DB_NAME, port=DB_PORT, charset='utf8mb4')
try:
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME='users' AND COLUMN_NAME='avatar'", (DB_NAME,))
        exists = cur.fetchone()[0]
        if exists:
            print('avatar column already exists')
        else:
            print('adding avatar column...')
            cur.execute('ALTER TABLE users ADD COLUMN avatar TEXT NULL')
            conn.commit()
            print('avatar column added')
finally:
    conn.close()
