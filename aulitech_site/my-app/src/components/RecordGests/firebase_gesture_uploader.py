import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

cred = credentials.Certificate('path/to/your/firebase/credentials.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'your-bucket-name.appspot.com'
})

def upload_to_firebase(local_file_path, cloud_file_path):
    bucket = storage.bucket()
    blob = bucket.blob(cloud_file_path)
    
    blob.upload_from_filename(local_file_path)

    print(f'File {local_file_path} uploaded to {cloud_file_path}.')

upload_to_firebase('log.txt', 'path/in/firebase/storage/log.txt')
