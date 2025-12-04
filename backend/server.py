import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app) 

# --- KONFIGURASI FOLDER UPLOAD ---
# Catatan: Di Vercel (Serverless), folder ini bersifat sementara.
# File akan hilang saat server restart. Untuk produksi serius, gunakan Cloudinary/AWS S3.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

try:
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
except OSError:
    pass # Abaikan error permission di Vercel

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- KONEKSI DATABASE PINTAR (LOCAL VS CLOUD) ---
def get_db_connection():
    # Cek apakah ada settingan Environment (biasanya ada di Vercel)
    if os.environ.get('DB_HOST'):
        return mysql.connector.connect(
            host=os.environ.get('DB_HOST'),
            user=os.environ.get('DB_USER'),
            password=os.environ.get('DB_PASSWORD'),
            database=os.environ.get('DB_NAME'),
            port=int(os.environ.get('DB_PORT', 3306))
        )
    else:
        # Jika tidak ada settingan online, pakai LOCALHOST (Laptop Abang)
        return mysql.connector.connect(
            host="localhost", 
            user="root", 
            password="", 
            database="roastery"
        )

@app.route('/')
def home():
    return jsonify({"status": "Server Berjalan", "waktu": str(datetime.now())})

# 1. AMBIL PRODUK
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()
        cursor.close(); conn.close()
        return jsonify(products)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# 2. REGISTER
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
        if cursor.fetchone(): 
            cursor.close(); conn.close()
            return jsonify({"message": "Email sudah terdaftar!"}), 400
            
        cursor.execute("INSERT INTO users (nama, email, password, role) VALUES (%s, %s, %s, 'user')", 
                       (data['nama'], data['email'], data['password']))
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"message": "Berhasil"}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

# 3. LOGIN
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (data['email'], data['password']))
        user = cursor.fetchone()
        cursor.close(); conn.close()
        if user: return jsonify({"message": "Sukses", "user": user}), 200
        return jsonify({"message": "Email atau Password Salah"}), 401
    except Exception as e: return jsonify({"error": str(e)}), 500

# 4. ORDER
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO orders (user_id, product_id, jumlah, total_harga, alamat_pengiriman, status, tanggal_order) VALUES (%s, %s, %s, %s, %s, 'pending', NOW())",
                       (data['user_id'], data['product_id'], data['jumlah'], data['total_harga'], data['alamat']))
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"message": "Order Berhasil"}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

# 5. RIWAYAT USER
@app.route('/api/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT orders.*, products.nama_produk, products.gambar FROM orders JOIN products ON orders.product_id = products.id WHERE orders.user_id = %s ORDER BY orders.tanggal_order DESC"
        cursor.execute(query, (user_id,))
        orders = cursor.fetchall()
        cursor.close(); conn.close()
        return jsonify(orders)
    except Exception as e: return jsonify({"error": str(e)}), 500

# 6. UPLOAD BUKTI BAYAR
@app.route('/api/upload_payment', methods=['POST'])
def upload_payment():
    if 'file' not in request.files: return jsonify({"message": "No file"}), 400
    file = request.files['file']
    order_id = request.form.get('order_id')
    
    if file and order_id:
        try:
            filename = secure_filename(f"bukti_order_{order_id}.jpg")
            # Pastikan folder ada (khusus local)
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
                
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE orders SET bukti_bayar=%s, status='menunggu_verifikasi' WHERE id=%s", (filename, order_id))
            conn.commit()
            cursor.close(); conn.close()
            return jsonify({"message": "Upload Berhasil"}), 200
        except Exception as e: return jsonify({"error": str(e)}), 500
    return jsonify({"message": "Gagal"}), 500

# 7. SELESAIKAN ORDER
@app.route('/api/finish_order', methods=['POST'])
def finish_order():
    if 'file' not in request.files: return jsonify({"message": "No file"}), 400
    file = request.files['file']
    order_id = request.form.get('order_id')
    
    if file and order_id:
        try:
            filename = secure_filename(f"bukti_terima_{order_id}.jpg")
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])

            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE orders SET status='selesai', bukti_diterima=%s WHERE id=%s", (filename, order_id))
            conn.commit()
            cursor.close(); conn.close()
            return jsonify({"message": "Order Selesai"}), 200
        except Exception as e: return jsonify({"error": str(e)}), 500
    return jsonify({"message": "Gagal"}), 500

# 8. ADMIN: ALL ORDERS
@app.route('/api/admin/orders', methods=['GET'])
def get_all_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT orders.*, users.nama as nama_pembeli, products.nama_produk, products.gambar FROM orders JOIN users ON orders.user_id = users.id JOIN products ON orders.product_id = products.id ORDER BY orders.id DESC"
        cursor.execute(query)
        orders = cursor.fetchall()
        cursor.close(); conn.close()
        return jsonify(orders)
    except Exception as e: return jsonify({"error": str(e)}), 500

# 9. ADMIN: UPDATE STATUS
@app.route('/api/admin/order_status', methods=['POST'])
def update_order_status():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        status_baru = data['status'].lower()

        if 'estimasi' in data:
            cursor.execute("UPDATE orders SET status = %s, estimasi_sampai = %s WHERE id = %s", 
                        (status_baru, data['estimasi'], data['order_id']))
        else:
            cursor.execute("UPDATE orders SET status = %s WHERE id = %s", 
                        (status_baru, data['order_id']))
            
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"message": "Updated"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# 10. IMAGE SERVER
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# 11. ADMIN: STATS
@app.route('/api/admin/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT COUNT(*) as total_user FROM users WHERE role='user'")
        total_user = cursor.fetchone()['total_user']
        
        cursor.execute("SELECT COUNT(*) as total_order FROM orders")
        total_order = cursor.fetchone()['total_order']
        
        cursor.execute("""
            SELECT COALESCE(SUM(total_harga), 0) as total_income 
            FROM orders 
            WHERE LOWER(status) IN ('lunas', 'dikirim', 'selesai')
        """)
        res = cursor.fetchone()
        income = res['total_income']
        
        cursor.close(); conn.close()
        return jsonify({"users": total_user, "orders": total_order, "income": float(income)})
    except Exception as e: return jsonify({"error": str(e)}), 500

# 12. ADMIN: REPORTS
@app.route('/api/admin/reports', methods=['GET'])
def get_financial_reports():
    month = request.args.get('month')
    year = request.args.get('year')
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT orders.tanggal_order, users.nama as nama_pelanggan, products.nama_produk, orders.total_harga, orders.status 
            FROM orders 
            JOIN users ON orders.user_id = users.id 
            JOIN products ON orders.product_id = products.id 
            WHERE MONTH(orders.tanggal_order) = %s 
            AND YEAR(orders.tanggal_order) = %s 
            AND LOWER(orders.status) IN ('lunas', 'dikirim', 'selesai')
            ORDER BY orders.tanggal_order DESC
        """
        cursor.execute(query, (month, year))
        reports = cursor.fetchall()
        
        cursor.execute("""
            SELECT COALESCE(SUM(total_harga), 0) as total_income 
            FROM orders 
            WHERE MONTH(tanggal_order) = %s 
            AND YEAR(tanggal_order) = %s 
            AND LOWER(status) IN ('lunas', 'dikirim', 'selesai')
        """, (month, year))
        
        res_income = cursor.fetchone()
        total_income = res_income['total_income'] if res_income else 0
        
        cursor.close(); conn.close()
        return jsonify({"reports": reports, "total_income": float(total_income)})
    except Exception as e: return jsonify({"error": str(e)}), 500

# 13. USERS LIST
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nama, email, created_at FROM users WHERE role='user'")
        users = cursor.fetchall()
        cursor.close(); conn.close()
        return jsonify(users)
    except Exception as e: return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)