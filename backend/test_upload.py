import requests

BACKEND_URL = 'http://localhost:8000'
SAMPLE_FILE = 'sample_tender.pdf'


def check_health():
    try:
        response = requests.get(BACKEND_URL + '/health', timeout=10)
        print('Health response:', response.text)
    except Exception as exc:
        print('Health check failed:', exc)


def upload_sample():
    try:
        with open(SAMPLE_FILE, 'rb') as f:
            files = {'file': (SAMPLE_FILE, f, 'application/pdf')}
            response = requests.post(BACKEND_URL + '/upload', files=files, timeout=120)
            print('Upload status:', response.status_code)
            print('Upload response:')
            print(response.text)
    except Exception as exc:
        print('Upload request failed:', exc)


if __name__ == '__main__':
    print('Checking backend health...')
    check_health()
    print()
    print('Uploading sample PDF...')
    upload_sample()
